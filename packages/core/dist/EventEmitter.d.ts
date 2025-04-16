import { StoryEventTypes } from './types';
/**
 * Generic event listener type
 */
type EventListener<T = any> = (data: T) => void;
/**
 * Event emitter implementation for StorySDK
 */
declare class EventEmitter {
    private events;
    /**
     * Subscribe to an event
     * @param eventName Name of the event to listen for
     * @param listener Callback function to execute when event occurs
     * @returns Unsubscribe function
     */
    on<T = any>(eventName: StoryEventTypes, listener: EventListener<T>): () => void;
    /**
     * Remove event listener
     * @param eventName Name of the event
     * @param listenerToRemove Listener to remove
     */
    off<T = any>(eventName: StoryEventTypes, listenerToRemove: EventListener<T>): void;
    /**
     * Emit an event with data
     * @param eventName Name of the event to emit
     * @param data Data to pass to listeners
     */
    protected emit<T = any>(eventName: StoryEventTypes, data?: T): void;
    /**
     * Subscribe to an event for one time only
     * @param eventName Name of the event to listen for
     * @param listener Callback function to execute when event occurs
     */
    once<T = any>(eventName: StoryEventTypes, listener: EventListener<T>): () => void;
}
export default EventEmitter;
