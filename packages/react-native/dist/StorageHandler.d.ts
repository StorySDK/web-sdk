/**
 * Class for handling storage messages between WebView and React Native
 */
export declare class StorageHandler {
    /**
     * Safe get item - uses AsyncStorage if available, falls back to memory storage
     */
    private static safeGetItem;
    /**
     * Safe set item - uses AsyncStorage if available, falls back to memory storage
     */
    private static safeSetItem;
    /**
     * Handles incoming messages from WebView related to storage
     * @param message Message from WebView
     * @param sendResponse Function to send a response back to WebView
     * @returns true if the message was handled, false otherwise
     */
    static handleMessage(message: any, sendResponse: (message: string) => void): Promise<boolean>;
}
