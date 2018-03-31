import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ImageZoom } from '../src';

const catImg = 'http://www.catster.com/wp-content/uploads/2017/08/Pixiebob-cat.jpg';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <ImageZoom portalId="portal">
          <img src={catImg} alt="Cat image"/>
        </ImageZoom>

        <div id="portal" />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('appContainer'));