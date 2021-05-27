import React, { useEffect, useRef, useState } from 'react';

import './Canvas.css';

import useCanvas from '../hooks/useCanvas';
import IScale from '../models/Scale';
import IPosition from '../models/Position';
import IViewport from '../models/Viewport';

interface ICanvasProps {
    draw: (context: CanvasRenderingContext2D) => void,
    onMouseMove: (position: IPosition) => void,
    onMouseUp: (position: IPosition) => void,
    onMouseDown: (position: IPosition) => void,
    onClick: (position: IPosition) => void,
}

const Canvas: React.FC<ICanvasProps> = ({
    draw,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    onClick,
}) => {
    const canvasRef = useCanvas(draw);

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        onMouseMove({x: event.clientX, y: event.clientY});
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        onMouseDown({x: event.clientX, y: event.clientY});
    };

    const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
        onMouseUp({x: event.clientX, y: event.clientY});
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        onClick({x: event.clientX, y: event.clientY});
    };

    return (
        <canvas
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            ref={canvasRef}
            style={{width: '100%', height: '100%'}}
            width={canvasRef.current?.offsetWidth}
            height={canvasRef.current?.offsetHeight}
        />
    );
};

export default Canvas;