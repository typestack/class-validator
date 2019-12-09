export declare function isPromise<T = any>(p: any): p is Promise<T>;
/**
 * Convert Map, Set to Array
 */
export declare function convertToArray<T>(val: Array<T> | Set<T> | Map<any, T>): Array<T>;
