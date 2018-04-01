import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ZoomContainer from './ZoomContainer';
import MagnifyingGlass, { MagnifyingGlassProps } from './MagnifyingGlass';

export interface ImageZoomProps {
  children: any;
  portalId: string;
  largeImgSrc?: string;
  imageWidth: number;
  imageHeight?: number;
  zoomWidth: number;
  activeClass?: string;
  portalStyle?: React.CSSProperties;
  zoomScale?: number;
}

export interface ImageZoomState {
  zoomX: number;
  zoomY: number;
  portalEl?: HTMLElement;
  isActive: boolean;
  glassX: number;
  glassY: number;
  glassWidth: number;
  glassHeight: number;
  zoomImageWidth?: number;
  zoomImageHeight?: number;
  scaleX: number;
  scaleY: number;
  offset?: any;
  offsetX: number;
  offsetY: number;
  lastScrollXPos?: number;
  lastScrollYPos?: number;
  zoomScale: number;
}

export default class ImageZoom extends React.Component<ImageZoomProps, ImageZoomState> {
  zoomContainer: HTMLElement;
  image: HTMLElement;
  zoomImage: HTMLImageElement;
  imgSrc: string;
  portalStyle: React.CSSProperties;

  toggle: () => void;
  deactivate: () => void;

  public static defaultPortalStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    width: '540px',
    top: 0,
    zIndex: 1,
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: true,
      portalEl: null,
      zoomX: 0,
      zoomY: 0,
      glassX: 0,
      glassY: 0,
      glassWidth: 40, // TODO: make 0
      glassHeight: 40, // TODO: make 0
      scaleX: 1,
      scaleY: 1,
      offsetX: 0,
      offsetY: 0,
      zoomScale: this.props.zoomScale || 1,
    };

    this.portalStyle = this.props.portalStyle ? this.props.portalStyle : ImageZoom.defaultPortalStyle;

    this.toggle = this.toggleActive.bind(this);
    this.deactivate = this.setInactive.bind(this);
    this.zoom = this.zoom.bind(this);
  }

  getOffset(el: HTMLElement) {
    if (el) {
      const elRect = el.getBoundingClientRect();
      return {left: elRect.left, top: elRect.top};
    }
    return {left: 0, top: 0};
  }

  componentDidMount() {
    const image = new Image();
    image.src = this.props.children.props.src;
    image.onload = () =>  {
      this.zoomImage = image;
      const scaleX = (image.naturalWidth * this.state.zoomScale) / this.props.imageWidth;
      const scaleY = (image.naturalHeight * this.state.zoomScale) / (this.props.imageHeight || image.height);
      const offset = this.getOffset(this.image);
      this.setState({
        offset, scaleX, scaleY,
        zoomImageWidth: image.naturalWidth * this.state.zoomScale,
        zoomImageHeight: image.naturalHeight * this.state.zoomScale,
        glassWidth: this.props.zoomWidth / scaleX,
        glassHeight: this.props.imageHeight / scaleY,
      });
      console.log('loaded image');
    }

    if (this.props.largeImgSrc) {
      this.imgSrc = this.props.largeImgSrc;
    } else {
      this.imgSrc = this.props.children && this.props.children.props.src;
    }
    const portalEl = document.getElementById(this.props.portalId);
    this.setState({portalEl: portalEl});
  }

  componentWillReceiveProps(newProps: ImageZoomProps) {
    let newGlassWidth, newZoomImageWidth;
    if (!this.zoomImage) return null;
    const minScale = this.image.offsetWidth/this.zoomImage.naturalWidth;
    if (newProps.zoomScale < minScale) return null;
    const scaleX = (this.zoomImage.naturalWidth * newProps.zoomScale) / this.props.imageWidth;
    const scaleY = (this.zoomImage.naturalHeight * newProps.zoomScale) / (this.props.imageHeight || this.zoomImage.height);
    newZoomImageWidth = this.zoomImage.naturalWidth * newProps.zoomScale;
    newGlassWidth = newProps.zoomWidth / scaleX;
    if (newGlassWidth > this.image.offsetWidth) {
      newGlassWidth = this.image.offsetWidth;
    };
    if (newZoomImageWidth < newGlassWidth) {
      newZoomImageWidth = newGlassWidth;
    };
    this.setState({
      glassWidth: newGlassWidth,
      glassHeight: this.props.imageHeight / scaleY,
      scaleX, scaleY,
      zoomImageWidth: newZoomImageWidth,
      zoomImageHeight: this.zoomImage.naturalHeight * newProps.zoomScale,
      zoomScale: newProps.zoomScale
    });
  }

  getGlassPos(evt: MouseEvent) {
    var a, x = 0, y = 0;
    const offset = this.getOffset(this.image);

    x = evt.pageX - offset.left;
    y = evt.pageY - offset.top;

    // check for page scroll
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    let glassX, glassY;
    // calculate glass position
    glassX = x - (this.state.glassWidth / 2);
    glassY = y - (this.state.glassHeight / 2);


    // prevent the glass from being positioned outside the image
    if (glassX > this.image.offsetWidth - this.state.glassWidth) {glassX = this.image.offsetWidth - this.state.glassWidth;}
    if (glassX < 0) glassX = 0;
    if (glassY > this.image.offsetHeight - this.state.glassHeight) {glassY = this.image.offsetHeight - this.state.glassHeight;}
    if (glassY < 0) glassY = 0;
    return {glassX, glassY};
  }

  zoom(evt: React.SyntheticEvent<any>): void {
    // Don't do anything if no image source, or is not currently active
    if (!this.imgSrc || !this.state.isActive) return null;

    const newState = this.getStateFromEvent(evt);
    this.setState(newState);
  }

  getPosition(v, min, max) {
    let val;
    if (v < min) val = min;
    if (v > max) val = max;
    if (!val) val = v;
    return val - min;
  }

  getZoomStateFromEvent(evt: MouseEvent): {x: number, y: number} {
    let x, y;
    let left = evt.clientX - this.state.offset.left;
    left = left + window.pageXOffset; // check for page scroll
    const leftMin = this.state.glassWidth / 2;
    const leftLimit = this.props.imageWidth - leftMin;
    const zoomLeft = this.getPosition(left, leftMin, leftLimit);

    let top = evt.clientY - this.state.offset.top;
    top = top + window.pageYOffset; // check for page scroll
    const topMin = this.state.glassHeight / 2;
    const topLimit = this.props.imageHeight - topMin;
    const zoomTop = this.getPosition(top, topMin, topLimit);

    x = zoomLeft * this.state.scaleX;
    y = zoomTop * this.state.scaleY;
    if (y < 0) y = 0;
    if (x < 0) x = 0;

    return {x, y};
  }

  getStateFromEvent(synthEvt: React.SyntheticEvent<any>) {
    const evt = synthEvt.nativeEvent as MouseEvent;

    const glassState = this.getGlassPos(evt);
    const zoomState = this.getZoomStateFromEvent(evt);

    return {
      zoomX: zoomState.x,
      zoomY: zoomState.y,
      ...glassState
    }
  }

  toggleActive(evt: React.SyntheticEvent<any>) {
    if (this.state.isActive) {
      this.setState({isActive: false});
    } else {
      let nativeEvent = evt.nativeEvent as MouseEvent;
      const newState = this.getStateFromEvent(evt);
      this.setState({
        ...newState,
        isActive: true,
      })
    }
  }

  setInactive() {
    this.setState({ isActive: false })
  }

  render() {
    if (!this.state.portalEl) {
      console.log('no portalEl');
      return null;
    }

    const imageContainerClass = 'image-zoom-container' + (this.state.isActive
      ? ' ' + (this.props.activeClass || "active")
      : ''
    );

    return (
      <React.Fragment>
        {this.state.isActive && this.state.zoomImageWidth &&
          ReactDOM.createPortal(
            <div ref={(el) => this.zoomContainer = el} style={this.portalStyle}>
              <ZoomContainer
                imgSrc={this.imgSrc}
                offsetX={this.state.offsetX}
                offsetY={this.state.offsetY}
                zoomX={this.state.zoomX}
                zoomY={this.state.zoomY}
                zoomImageWidth={this.state.zoomImageWidth}
                zoomWidth={this.props.zoomWidth}
                />
            </div>,
            this.state.portalEl,
          )
        }
        <div
          ref={(el) => this.image = el}
          onClick={this.toggle}
          onMouseLeave={this.deactivate}
          onMouseMove={this.zoom}
          className={imageContainerClass}
          >
          {this.state.isActive && this.state.offset &&
            <MagnifyingGlass
              x={this.state.glassX + this.state.offset.left}
              y={this.state.glassY + this.state.offset.top}
              width={this.state.glassWidth}
              height={this.state.glassHeight}
              />
          }
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}