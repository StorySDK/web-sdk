import { SliderWidgetElementsType, SliderWidgetParamsType, WidgetComponent } from '@types';
import './SliderWidget.scss';
export declare const SliderWidget: WidgetComponent<{
    id: string;
    storyId: string;
    params: SliderWidgetParamsType;
    elementsSize?: SliderWidgetElementsType;
    isReadOnly?: boolean;
    onAnswer?(value: number): void;
}>;
