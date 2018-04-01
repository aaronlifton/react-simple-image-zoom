## React simple image zoom
A simple image zoom component

![Example](https://github.com/aaronlifton2/react-simple-image-zoom/blob/master/docs/assets/react-simple-image-zoom-example.png?raw=true)


### Install
npm:
`npm install --save react-simple-image-zoom`
yarn:
`yarn add react-simple-image-zoom`

### Usage
```tsx
import { ImageZoom } from 'react-simple-image-zoom';
const largeCatImg = 'https://www.nationalgeographic.com/content/dam/animals/thumbs/rights-exempt/mammals/d/domestic-cat_thumb.ngsversion.1472140774957.adapt.1900.1.jpg';

const App = () =>
  <div id="app">
    <div style={{width: "540px", marginLeft: "20px", overflow: "hidden"}}>
      <ImageZoom portalId="portal" largeImgSrc={largeCatImg}
        imageWidth={540} imageHeight={540} zoomWidth={this.state.zoomWidth} activeClass="my-active"
        portalStyle={Object.assign(ImageZoom.defaultPortalStyle, {top: '120px'})}
        zoomScale={this.state.zoomScale / 100}
        >
        <img src={largeCatImg} alt="Cat image" width="100%"/>
      </ImageZoom>
    </div>

    <div id="portal" />
  </div>

ReactDOM.render(<App />, 'myAppContainer');
```

See `./demo` for a more detailed example.

### Props

| prop | required | type | description  |
| ------------- |----------|--------|-----|
| children      |yes| any        | pass the source image in as a child element |
| portalId      |yes| string     | ID of the target portal element |
| largeImgSrc   |no| string      | optional high-res source to use for the zoom container |
| imageWidth    |yes| number     | width of the original image on the screen |
| imageHeight   |no| number      | optional, pass in an image height to use for calculations. otherwise this component will figure it out.|
| zoomWidth     |yes| number     | width of the portal zoom |
| activeClass   |no| string      | optional, default is 'active'. applies this class to the image container when zooming is active |
| portalStyle   |no| React.CSSProperties | optional, override the style of the portal. To extend the default style, use `ImageZoom.defaultPortalStyle` |
| zoomScale     |no| number      | optional, default is 1. Determines the amount of zoom. |
```

### Usage with react-slick
- For the magnifying glass to work, make sure you style `.slick-side` like this:
  ```css
  .slick-side {
    position: relative;
  }
  ```
