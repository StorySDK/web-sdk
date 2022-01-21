import { FC } from 'react';
import './SliderThumb.scss';
interface Props {
    props: any;
    emoji: string;
    changeStatus: string;
    currentPosition: number;
    initSize?: number;
}
export declare const SliderThumb: FC<Props>;
export {};
