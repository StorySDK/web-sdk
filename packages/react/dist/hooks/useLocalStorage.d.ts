declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}
export declare const useLocalStorage: (key: string, initialValue: any) => any[];
