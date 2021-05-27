import React, { useCallback, useEffect, useRef, useState } from 'react';

import './App.css';
import Canvas from './components/Canvas';
import useFixedPixelMap from './hooks/useFixedPixelMap';
import useRandomPixelMap from './hooks/useRandomPixelMap';
import useViewport from './hooks/useViewport';
import IPosition from './models/Position';
import IViewport, { DefaultViewport } from './models/Viewport';

const PIXEL_CANVAS_HEIGHT = 100;
const PIXEL_CANVAS_WIDTH = 100;

const App: React.FC<{}> = () => {
  const { randomPixelMap, setPixel, setClean } = useFixedPixelMap(PIXEL_CANVAS_HEIGHT, PIXEL_CANVAS_WIDTH);
  const [offset, setOffset] = useState<IPosition>({x: 0, y: 0});
  const [initialOffset, setInitialOffset] = useState<IPosition>();
  const dummyCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    viewport,
    increaseZoom,
    decreaseZoom,
    convert,
  } = useViewport(
    canvasRef.current?.clientHeight ?? 0,
    canvasRef.current?.clientWidth ?? 0,
    PIXEL_CANVAS_HEIGHT,
    PIXEL_CANVAS_WIDTH,
    offset,
  );

  const handleScroll = useCallback((event: React.WheelEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (event.deltaY > 0) {
      decreaseZoom();
    } else {
      increaseZoom();
    }
  }, [decreaseZoom, increaseZoom]);

  const draw = useCallback((context: CanvasRenderingContext2D) => {
    const dummyContext = dummyCanvasRef.current?.getContext('2d');
    if (dummyContext) {
      dummyContext.clearRect(0, 0, dummyContext.canvas.width, dummyContext.canvas.height);
      const imageData = dummyContext.createImageData(PIXEL_CANVAS_WIDTH, PIXEL_CANVAS_HEIGHT);

      for (let i = 0; i < randomPixelMap.data.length; i++) {
        let j = i * 4;

        imageData.data[j] = randomPixelMap.data[i].r;
        imageData.data[j + 1] = randomPixelMap.data[i].g;
        imageData.data[j + 2] = randomPixelMap.data[i].b;
        imageData.data[j + 3] = randomPixelMap.data[i].a;
      }

      dummyContext.putImageData(imageData, 0, 0);
    }

    const height = context.canvas.clientHeight;
    const width = context.canvas.clientWidth;

    if (dummyContext?.canvas) {
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.drawImage(
        dummyContext.canvas,
        viewport.x, viewport.y, viewport.width, viewport.height,
        0, 0, width, height,
      );
    }
  }, [viewport, dummyCanvasRef, randomPixelMap]);

  const handleMouseDown = useCallback((position: IPosition) => {
    setInitialOffset({
      x: position.x,
      y: position.y,
    });
  }, [setInitialOffset]);

  const handleMouseUp = useCallback((position: IPosition) => {
    setInitialOffset(undefined);
  }, [setInitialOffset]);

  const handleMouseClick = useCallback((position: IPosition) => {
    console.log(convert(position, viewport));
    setPixel(convert(position, viewport));
  }, [convert, viewport]);

  const handleMouseMove = useCallback((position: IPosition) => {
    if (initialOffset) {
      setOffset((offset) => ({
        x: offset.x + position.x - initialOffset.x,
        y: offset.y + position.y - initialOffset.y,
      }));
      setInitialOffset({
        x: position.x,
        y: position.y,
      });
    }
    // We need to determine the position in the canvas
  }, [viewport, setInitialOffset, setOffset, initialOffset, convert]);

  return (
    <div className="App">
      <div
        ref={canvasRef}
        className="App-Canvas"
        onWheel={handleScroll}
        onMouseLeave={(e) => handleMouseUp({x:0, y:0})}
      >
          <canvas className="App-Dummy-Canvas" ref={dummyCanvasRef} height={PIXEL_CANVAS_HEIGHT} width={PIXEL_CANVAS_WIDTH} style={{width: '100%', height: '100%'}} />
          <Canvas
            draw={draw}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onClick={handleMouseClick}
          />
      </div>
    </div>
  );
}

export default App;
