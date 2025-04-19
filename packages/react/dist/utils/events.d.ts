export declare const eventSubscribe: (eventName: string, listener: (params?: any) => void) => void;
export declare const eventUnsubscribe: (eventName: string, listener: (params?: any) => void) => void;
export declare const eventPublish: (eventName: string, data?: any) => void;
