import { TalkAboutWidgetParamsType, WidgetComponent, TalkAboutElementsType } from '@types';
import './TalkAboutWidget.scss';
export declare const TalkAboutWidget: WidgetComponent<{
    id: string;
    params: TalkAboutWidgetParamsType;
    elementsSize?: TalkAboutElementsType;
    isReadOnly?: boolean;
    onAnswer?(answer: string): void;
}>;
