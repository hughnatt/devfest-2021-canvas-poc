import { useCallback, useEffect, useState } from "react";
import IPixelMap from "../models/PixelMap";
import IPosition from "../models/Position";

const useFixedPixelMap = (
  height: number,
  width: number,
) => {
  const [pixelMap, setPixelMap] = useState<IPixelMap>({ data: []});

  useEffect(() => {
    for (let i = 0; i < height * width; i++) {
      pixelMap.data.push({
        r: 255,
        g: 255,
        b: 255,
        a: 255,
      });
    }

    for (let i = 0; i < height * width; i ++) {
        if (
            i % width === 0 ||
            i % width === width - 1 ||
            i < width ||
            i > (width-1) * width
        ) {
            pixelMap.data[i] = {
                r: 0,
                g: 0,
                b: 0,
                a: 255,
            }
        }
    }
  }, [width, height]);

  const setPixel = useCallback((position: IPosition) => {
    const index = position.y * width + position.x;
    pixelMap.data[index] = {
      r: 255,
      g: 0,
      b: 0,
      a: 255,
    };
    setPixelMap({
      ...pixelMap,
      dirty: true,
    });
  }, [pixelMap]);

  const setClean = useCallback(() => {
    setPixelMap({
      ...pixelMap,
      dirty: undefined,
    });
  }, [pixelMap]);

  return {
      randomPixelMap: pixelMap,
      setPixel,
      setClean,
  };

};

export default useFixedPixelMap;