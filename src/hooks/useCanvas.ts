import { useRef, useEffect, useCallback } from 'react'
import IViewport from '../models/Viewport';

const useCanvas = (
    draw: (context: CanvasRenderingContext2D) => void,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const handleResize = useCallback(() => {
  //   if (canvasRef?.current) {
  //     canvasRef.current.width = canvasRef.current.clientWidth;
  //     canvasRef.current.height = canvasRef.current.clientHeight;
  //   }
  // }, [canvasRef]);

  // useEffect(() => {
  //   const currentCanvas = canvasRef.current;
  //   if (currentCanvas) {
  //     currentCanvas.addEventListener("resize", handleResize);
  //     return () => currentCanvas.removeEventListener("resize", handleResize);
  //   }
  // }, [handleResize]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (context) {

      const render = () => {
          draw(context);
      };

      render();
    }

  }, [draw, canvasRef]);

  return canvasRef;
};

export default useCanvas;