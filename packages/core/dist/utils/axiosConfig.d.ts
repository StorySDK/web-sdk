export interface AxiosConfigOptions {
    devMode?: 'staging' | 'development';
    isDebugMode?: boolean;
    token?: string;
}
/**
 * Ensures axios is properly configured with baseURL and Authorization header
 */
export declare const ensureAxiosConfig: (options?: AxiosConfigOptions) => boolean;
/**
 * Gets current axios configuration for debugging
 */
export declare const getAxiosConfigDebugInfo: () => {
    baseURL: string | undefined;
    hasAuthorization: boolean;
    authorizationPrefix: string;
};
