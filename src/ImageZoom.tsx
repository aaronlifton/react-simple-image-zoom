import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface ImageZoomProps {
  children?: any;
  portalId: string;
}

interface ImageZoomState {
  positionX: number;
  positionY: number;
  portalEl?: HTMLElement;
  isActive: boolean;
}

export default class ImageZoom extends React.Component<ImageZoomProps, ImageZoomState> {
  zoomContainer: HTMLElement;
  image: HTMLElement;
  imgSrc: HTMLImageElement;

  constructor(props) {
    super(props);
    this.state = { isActive: false, portalEl: null, positionX: 0, positionY: 0 };
  }

  componentDidMount() {
    this.imgSrc = this.props.children && this.props.children.props.src;
    this.setState({portalEl: document.getElementById(this.props.portalId)});
  }

  zoom(evt: React.SyntheticEvent<any>): void {
    // Don't do anything if no image source, or is not currently active
    if (!this.imgSrc || !this.state.isActive) return null;

    const newState = this.getPositionStateFromEvent(evt);
    this.setState(newState);
  }

  getPositionStateFromEvent(synthEvt: React.SyntheticEvent<any>) {
    const evt = synthEvt.nativeEvent as MouseEvent;
    let zoomer = (this.zoomContainer || this.image) as HTMLElement;
    let x, y;
    let offsetX, offsetY;
    evt.offsetX ? offsetX = evt.offsetX : offsetX = evt.pageX;
    evt.offsetY ? offsetY = evt.offsetY : offsetX = evt.pageX;
    x = offsetX/zoomer.offsetWidth * 100
    y = offsetY/zoomer.offsetHeight * 100
    return {
      positionX: x,
      positionY: y
    }
  }

  toggleActive(evt: React.SyntheticEvent<any>) {
    if (this.state.isActive) {
      this.setState({isActive: false});
    } else {
      let nativeEvent = evt.nativeEvent as MouseEvent;
      const newState = this.getPositionStateFromEvent(evt);
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

    return (
      <React.Fragment>
        {this.state.isActive &&
          ReactDOM.createPortal(
            <div
              ref={(el) => this.zoomContainer = el}
              className="zoom-container"
              style={{
                paddingBottom: "100%",
                backgroundImage: `url("${this.imgSrc}")`,
                backgroundPosition: `${this.state.positionX}% ${this.state.positionY}%`
                }}
              />,
            this.state.portalEl,
          )
        }
        <div
          ref={(el) => this.image = el}
          onClick={(evt) => this.toggleActive(evt)}
          onMouseLeave={() => this.setInactive()}
          onMouseMove={this.zoom.bind(this)}
          >
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}