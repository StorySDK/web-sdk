import { ImageWidgetParamsType, WidgetComponent } from '@types';
import './ImageWidget.scss';
export declare const ImageWidget: WidgetComponent<{
    params: ImageWidgetParamsType;
    handleMediaLoading?: (isLoading: boolean) => void;
    width?: number;
    height?: number;
}>;
