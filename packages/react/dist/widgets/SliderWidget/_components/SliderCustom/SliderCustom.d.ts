import { FC } from 'react';
import './SliderCustom.scss';
interface Props {
    emoji: string;
    changeStatus: string;
    value: number;
    initSize?: number;
    disabled?: boolean;
    onChange?: (valueChanged: number) => void;
    height: number;
    onAfterChange?: () => void;
    onBeforeChange?: () => void;
}
export declare const SliderCustom: FC<Props>;
export {};
