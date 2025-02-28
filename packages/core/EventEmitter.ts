import { StoryEventTypes } from './types';

/**
 * Generic event listener type
 */
type EventListener<T = any> = (data: T) => void;

/**
 * Event dictionary type
 */
interface EventMap {
  [eventName: string]: EventListener[];
}

/**
 * Event emitter implementation for StorySDK
 */
class EventEmitter {
  private events: EventMap = {};

  /**
   * Subscribe to an event
   * @param eventName Name of the event to listen for
   * @param listener Callback function to execute when event occurs
   * @returns Unsubscribe function
   */
  public on<T = any>(eventName: StoryEventTypes, listener: EventListener<T>): () => void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(listener as EventListener);

    // Return unsubscribe function
    return () => this.off(eventName, listener);
  }

  /**
   * Remove event listener
   * @param eventName Name of the event
   * @param listenerToRemove Listener to remove
   */
  public off<T = any>(eventName: StoryEventTypes, listenerToRemove: EventListener<T>): void {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName] = this.events[eventName].filter(
      (listener) => listener !== listenerToRemove
    );
  }

  /**
   * Emit an event with data
   * @param eventName Name of the event to emit
   * @param data Data to pass to listeners
   */
  protected emit<T = any>(eventName: StoryEventTypes, data?: T): void {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName].forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error(`StorySDK - Error in event listener for ${eventName}:`, error);
      }
    });
  }

  /**
   * Subscribe to an event for one time only
   * @param eventName Name of the event to listen for
   * @param listener Callback function to execute when event occurs
   */
  public once<T = any>(eventName: StoryEventTypes, listener: EventListener<T>): () => void {
    const onceWrapper = (data: T) => {
      listener(data);
      this.off(eventName, onceWrapper);
    };

    return this.on(eventName, onceWrapper);
  }
}

export default EventEmitter;
