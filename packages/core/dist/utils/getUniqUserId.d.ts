declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
export declare const getUniqUserId: () => string | Promise<unknown>;
