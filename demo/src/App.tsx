import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImageZoom } from '../../src';
import Slider from 'rc-slider';

const catImg = 'http://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg';
const largeCatImg = 'https://www.nationalgeographic.com/content/dam/animals/thumbs/rights-exempt/mammals/d/domestic-cat_thumb.ngsversion.1472140774957.adapt.1900.1.jpg';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="slider">
          <h3>Slider</h3>
          <Slider min={300} max={1900} />
        </div>
        <div style={{width: "540px", marginLeft: "20px", overflow: "hidden"}}>
          <ImageZoom portalId="portal" largeImgSrc={largeCatImg}
            imageWidth={540} imageHeight={540} zoomWidth={300} activeClass="active"
            portalStyle={Object.assign(ImageZoom.defaultPortalStyle, {top: '50px'})}>
            <img src={largeCatImg} alt="Cat image" width="100%"/>
          </ImageZoom>
        </div>

        <div id="portal" />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('appContainer'));