/// <reference types="react" />
import * as React from 'react';
export interface ImageZoomProps {
    children: any;
    portalId: string;
    largeImgSrc?: string;
    imageWidth: number;
    imageHeight?: number;
    zoomContainerWidth: number;
    zoomContainerHeight?: number;
    activeClass?: string;
    portalStyle?: React.CSSProperties;
    portalClassName?: string;
    zoomScale?: number;
    responsive?: boolean;
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
    imageWidth: number;
    imageHeight?: number;
    zoomContainerWidth: number;
}
export default class ImageZoom extends React.Component<ImageZoomProps, ImageZoomState> {
    zoomContainer: HTMLElement;
    image: HTMLElement;
    zoomImage: HTMLImageElement;
    imgSrc: string;
    portalStyle: React.CSSProperties;
    toggle: () => void;
    deactivate: () => void;
    onResize: () => void;
    static defaultPortalStyle: React.CSSProperties;
    constructor(props: any);
    getOffset(el: HTMLElement): {
        left: number;
        top: number;
    };
    calcScaleX(width: number, zoomScale?: number): number;
    calcScaleY(height: number, zoomScale?: number): number;
    calcZoomImageWidth(zoomScale?: number): number;
    calcZoomImageHeight(zoomScale?: number): number;
    getPortalStyle(): React.CSSProperties;
    onWindowResize(): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(newProps: ImageZoomProps): any;
    getGlassPos(evt: MouseEvent): {
        glassX: any;
        glassY: any;
    };
    zoom(evt: React.SyntheticEvent<any>): void;
    getPosition(v: any, min: any, max: any): number;
    getZoomStateFromEvent(evt: MouseEvent): {
        x: number;
        y: number;
    };
    getStateFromEvent(synthEvt: React.SyntheticEvent<any>): {
        glassX: any;
        glassY: any;
        zoomX: number;
        zoomY: number;
    };
    toggleActive(evt: React.SyntheticEvent<any>): void;
    setInactive(): void;
    render(): JSX.Element;
}
