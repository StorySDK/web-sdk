export type Result<T> = [T, (value: T) => void];
export declare function useLocalStorage<T>(key: string, initialValue: T): Result<T>;
export default useLocalStorage;
