import { SliderWidgetParamsType, WidgetComponent, WidgetPositionType, WidgetPositionLimitsType } from '../../types';
import './SliderWidget.scss';
export declare const SliderWidget: WidgetComponent<{
    storyId: string;
    params: SliderWidgetParamsType;
    position?: WidgetPositionType;
    positionLimits?: WidgetPositionLimitsType;
    onSlide?(value: number): void;
}>;
