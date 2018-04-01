/// <reference types="react" />
import { ImageZoomState } from './ImageZoom';
declare const ZoomContainer: (props: Partial<ImageZoomState> & {
    zoomWidth: number;
    imgSrc: string;
}) => JSX.Element;
export default ZoomContainer;
