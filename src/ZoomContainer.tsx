import * as React from 'react';
import { ImageZoomState } from './ImageZoom';

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
        backgroundSize: `${props.zoomImageWidth}px`,
        backgroundRepeat: 'no-repeat',
        }}
      />
  );
}

export default ZoomContainer;