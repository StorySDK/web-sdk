import { FC } from 'react';
import './SliderCustom.scss';
interface SliderCustomProps {
    emoji: string;
    changeStatus: string;
    value: number;
    initSize?: number;
    disabled?: boolean;
    onChange?: (valueChanged: number) => void;
    height: number;
    borderRadius: number;
    onAfterChange?: () => void;
    onBeforeChange?: () => void;
}
export declare const SliderCustom: FC<SliderCustomProps>;
export {};
