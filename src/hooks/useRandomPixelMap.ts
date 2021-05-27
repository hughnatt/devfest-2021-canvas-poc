import { useEffect, useState } from "react";
import IPixelMap from "../models/PixelMap";

const useRandomPixelMap = (
  height: number,
  width: number,
) => {
  const [pixelMap] = useState<IPixelMap>({ data: []});

  useEffect(() => {
    for (let i = 0; i < 4 * height * width; i += 4) {
      pixelMap.data.push({
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
        a: 255,
      });
    }
  }, [width, height]);

  return {
      randomPixelMap: pixelMap,
  };
};

export default useRandomPixelMap;