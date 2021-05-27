import { useCallback, useEffect, useState } from "react";
import IPosition from "../models/Position";
import IViewport, { DefaultViewport } from "../models/Viewport";

const useViewport = (
    height: number,
    width: number,
    originalHeight: number,
    originalWidth: number,
    offset: IPosition,
) => {
    const [zoom, setZoom] = useState(0);
    const [viewport, setViewport] = useState(DefaultViewport);

    const increaseZoom = useCallback(() => {
        setZoom((z) => z === 0 ? z : z - 1);
    }, [setZoom]);

    const decreaseZoom = useCallback(() => {
      setZoom((z) => z === 9 ? z : z + 1);
    }, [setZoom]);

    useEffect(() => {
        if (width && height) {
            let updatedViewport: IViewport = DefaultViewport;

            if (width > height) {
                updatedViewport.height = originalHeight;
                updatedViewport.width = originalWidth * width / height;
            } else {
                updatedViewport.width = originalWidth;
                updatedViewport.height = originalHeight * height / width;
            }

            // Apply zoom to viewport
            updatedViewport.height = updatedViewport.height * (10 - zoom) / 10;
            updatedViewport.width = updatedViewport.width * (10 - zoom) / 10;

            // Compute viewport top-left reference point
            updatedViewport.x = (originalWidth - updatedViewport.width) / 2;
            updatedViewport.y = (originalHeight - updatedViewport.height) / 2;

            // Apply offset
            updatedViewport.x = updatedViewport.x - (offset.x / width * updatedViewport.width);
            updatedViewport.y = updatedViewport.y - (offset.y / height * updatedViewport.height);

            // TODO limit offset

            setViewport({...updatedViewport});
        }
    }, [width, height, originalHeight, originalWidth, offset, zoom]);

    const convert = useCallback((position: IPosition, viewport: IViewport) => {
        return {
            x: Math.floor(position.x / width * viewport.width + viewport.x),
            y: Math.floor(position.y / height * viewport.height + viewport.y),
        }
    }, [offset, width, height]);

    return {
        viewport,
        increaseZoom,
        decreaseZoom,
        convert,
    };
};

export default useViewport;