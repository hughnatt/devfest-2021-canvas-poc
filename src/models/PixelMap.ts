import IPixel from "./Pixel";

interface IPixelMap {
    data: IPixel[],
    dirty?: boolean,
}

export default IPixelMap;