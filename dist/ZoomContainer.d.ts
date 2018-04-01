/// <reference types="react" />
import { ImageZoomState } from './ImageZoom';
declare const ZoomContainer: (props: Partial<ImageZoomState> & {
    zoomContainerHeight: number;
    imgSrc: string;
}) => JSX.Element;
export default ZoomContainer;
