class ScrollZoom {
  state: any;
  setState: (any) => void;
  image: HTMLImageElement;

  attachPageScrollListener() {
    window.addEventListener('scroll', (e: Event) => {
      const pageXOffset = window.pageXOffset;
      const pageYOffset = window.pageYOffset;
      const newZoomState = this.getZoomStateFromCurrentState(pageXOffset, pageYOffset)
      const newGlassState = this.getGlassStateFromCurrentState(pageXOffset, pageYOffset)
      this.setState({
        lastScrollXPos: pageXOffset,
        lastScrollYPos: pageYOffset,
        ...newZoomState,
        ...newGlassState
      });
    });
  }

  getGlassStateFromCurrentState(pageXOffset: number, pageYOffset: number) {
    let x, y;
    if (this.state.lastScrollXPos > pageXOffset) {
      x = this.state.glassX - pageXOffset;
    } else {
      x = this.state.glassX + pageXOffset;
    };
    y = this.state.glassY + pageYOffset;
    if (x > this.image.offsetWidth - this.state.glassWidth) {x = this.image.offsetWidth - this.state.glassWidth;}
    if (x < 0) x = 0;
    if (y > this.image.offsetHeight - this.state.glassHeight) {y = this.image.offsetHeight - this.state.glassHeight;}
    if (y < 0) y = 0;
    return {glassX: x, glassY: y};
  }

  getZoomStateFromCurrentState(pageXOffset: number, pageYOffset: number) {
    let x, y;
    if (this.state.lastScrollXPos > pageXOffset) {
      x = this.state.zoomX - (pageXOffset / this.state.scaleX);
    } else {
      x = this.state.zoomX + (pageXOffset / this.state.scaleX);
    };
    if (this.state.lastScrollYPos > pageYOffset) {
      y = this.state.zoomY + (pageYOffset  / this.state.scaleY);
    } else {
      y = this.state.zoomY - (pageYOffset / this.state.scaleY);
    };
    return {zoomX: x, zoomY: y};
  }
}