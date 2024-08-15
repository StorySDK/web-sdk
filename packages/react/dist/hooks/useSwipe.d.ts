import { TouchEvent } from 'react';
interface SwipeInput {
    onSwipedLeft?: () => void;
    onSwipedRight?: () => void;
}
export interface SwipeOutput {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
}
export declare const useSwipe: (input: SwipeInput) => SwipeOutput;
export {};
