/**
 * Simple logger with production mode disabling capability
 */
export declare const Logger: {
    isProduction: boolean;
    error(message: string, error?: any): void;
    warn(message: string, data?: any): void;
    info(message: string, data?: any): void;
    debug(message: string, data?: any): void;
};
export default Logger;
