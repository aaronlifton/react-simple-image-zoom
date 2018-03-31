import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface MagnifyingGlassProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MagnifyingGlass = (props: MagnifyingGlassProps) => {
  console.log({glassY: props.y})
  return <div className="glass" style={{
    pointerEvents: "none",
    position: "absolute",
    top: `${props.y}px`,
    left: `${props.x}px`,
    background: '#eee',
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: "rgba(0,0,0,.2)",
    // outline: "1px solid rgba(0,0,0,0.8)",
    zIndex: 2
  }} />
};

interface ImageZoomProps {
  children?: any;
  portalId: string;
  largeImgSrc?: string;
  largeImgSize?: number;
  imageWidth: number;
  imageHeight?: number;
  zoomWidth: number;
  activeClass?: string;
  portalStyle?: React.CSSProperties;
}

interface ImageZoomState {
  zoomX: number;
  zoomY: number;
  portalEl?: HTMLElement;
  isActive: boolean;
  glassX: number;
  glassY: number;
  glassWidth: number;
  glassHeight: number;
  zoomImageNaturalWidth?: number;
  zoomImageNaturalHeight?: number;
  scaleX: number;
  scaleY: number;
  offset?: any;
  offsetX: number;
  offsetY: number;
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
      glassWidth: 146,
      glassHeight: 146,
      scaleX: 1,
      scaleY: 1,
      offsetX: 0,
      offsetY: 0,
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
      const scaleX = image.naturalWidth / this.props.imageWidth;
      const scaleY = image.naturalHeight / (this.props.imageHeight || image.height);
      const offset = this.getOffset(this.image);
      this.setState({
        offset, scaleX, scaleY,
        zoomImageNaturalWidth: image.naturalWidth,
        zoomImageNaturalHeight: image.naturalHeight,
        // glassWidth: this.props.imageWidth / scaleX,
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

  getGlassPos(evt: MouseEvent) {
    var a, x = 0, y = 0;
    /*get the x and y positions of the image:*/
    const offset = this.getOffset(this.image);
    /*calculate the cursor's x and y coordinates, relative to the image:*/
    console.log({offsetX: evt.offsetX, offsetY: evt.offsetY})

    x = evt.pageX - offset.left;
    y = evt.pageY - offset.top;
    console.log({y, offsetTop: offset.top})
    /*consider any page scrolling :*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    console.log({windowPageYOffset: window.pageYOffset})

    let glassX, glassY;
    // calculate the position of the lens
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
    const left = evt.clientX - this.state.offset.left;
    const leftMin = this.state.glassWidth / 2;
    const leftLimit = this.props.imageWidth - leftMin;
    const zoomLeft = this.getPosition(left, leftMin, leftLimit);

    const top = evt.clientY - this.state.offset.top;
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
        {this.state.isActive && this.state.zoomImageNaturalWidth &&
          ReactDOM.createPortal(
            <div ref={(el) => this.zoomContainer = el} style={this.portalStyle}>
              <ZoomContainer
                imgSrc={this.imgSrc}
                offsetX={this.state.offsetX}
                offsetY={this.state.offsetY}
                zoomX={this.state.zoomX}
                zoomY={this.state.zoomY}
                zoomImageNaturalWidth={this.state.zoomImageNaturalWidth}
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

const ZoomContainer = (props: Partial<ImageZoomState> & {zoomWidth: number, imgSrc: string}) => {
  return (
    <div
      className="zoom-container"
      style={{
        width: `${props.zoomWidth}px`,
        paddingBottom: "100%",
        backgroundImage: `url("${props.imgSrc}")`,
        backgroundTop: `${props.offsetX}`,
        backgroundLeft: `${props.offsetY}`,
        backgroundPosition: `-${props.zoomX}px -${props.zoomY}px`,
        backgroundSize: `${props.zoomImageNaturalWidth}px`,
        backgroundRepeat: 'no-repeat',
        }}
      />
  );
}