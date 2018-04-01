import * as React from 'react';

export interface MagnifyingGlassProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MagnifyingGlass = (props: MagnifyingGlassProps) => {
  return <div className="glass" style={{
    pointerEvents: "none",
    position: "absolute",
    top: `${props.y}px`,
    left: `${props.x}px`,
    background: '#eee',
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: "rgba(0,0,0,.2)",
    // outline: "1px solid rgba(0,0,0,0.8)",
    zIndex: 2
  }} />
};

export default MagnifyingGlass;