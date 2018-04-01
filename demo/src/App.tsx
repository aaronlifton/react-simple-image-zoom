import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImageZoom } from '../../src';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const catImg = 'http://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg';
const largeCatImg = 'https://www.nationalgeographic.com/content/dam/animals/thumbs/rights-exempt/mammals/d/domestic-cat_thumb.ngsversion.1472140774957.adapt.1900.1.jpg';

interface AppState {
  zoomWidth: number;
  zoomScale: number;
  isResponsive: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { zoomWidth: 540, zoomScale: 100, isResponsive: false };
  }

  onZoomWidthSliderChange(val: number) {
    this.setState({zoomWidth: val});
  }

  onZoomScaleSliderChange(val: number) {
    this.setState({zoomScale: val});
  }

  toggleResponsive() {
    this.setState({isResponsive: !this.state.isResponsive})
  }

  render() {
    const minScale = 540/1900;
    let zoomMarks = {
      50: '.5',
      66: '.66',
      75: '.75',
      100: '1'
    }
    zoomMarks[minScale * 100] = minScale.toFixed(2);
    return (
      <div className="app">
        <div className="header">
          <h1>React simple image zoom</h1>
          <div className="toggle-control">
            <input type="checkbox" onChange={this.toggleResponsive.bind(this)} /> Responsive
          </div>
          <div className="controls">
            <div id="zoomWidth" className="slider-control">
              <h3>zoomWidth: {this.state.zoomWidth}</h3>
              <Slider value={this.state.zoomWidth} min={300} max={1900} onChange={(v) => this.onZoomWidthSliderChange(v)} />
            </div>
            <div id="zoomScale" className="slider-control">
              <h3>zoomScale: {(this.state.zoomScale / 100).toFixed(2)}</h3>
              <Slider marks={zoomMarks} value={this.state.zoomScale} min={minScale * 100} max={100} onChange={(v) => this.onZoomScaleSliderChange(v)} />
            </div>
          </div>
        </div>
        <div className="image-view">
          <div style={{width: "540px", marginLeft: "20px", overflow: "hidden"}}>
            <ImageZoom portalId="portal" largeImgSrc={largeCatImg}
              imageWidth={540} imageHeight={540} zoomContainerWidth={this.state.zoomWidth} activeClass="active"
              portalStyle={Object.assign({...ImageZoom.defaultPortalStyle}, {top: "140px"})}
              zoomScale={this.state.zoomScale / 100} responsive={this.state.isResponsive}
              >
              <img src={largeCatImg} alt="Cat image" width="100%"/>
            </ImageZoom>
          </div>

          <div id="portal" />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('appContainer'));