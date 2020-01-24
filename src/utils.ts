// https://github.com/TylorS/typed-is-promise/blob/abf1514e1b6961adfc75765476b0debb96b2c3ae/src/index.ts

export function isPromise<T = any>(p: any): p is Promise<T> {
    return p !== null && typeof p === "object" && typeof p.then === "function";
}

/**
 * Convert Map, Set to Array
 */
export function convertToArray<T>(val: Array<T> | Set<T> | Map<any, T>): Array<T> {
    if (val instanceof Map) {
        return Array.from(val.values());
    }
    return Array.isArray(val) ? val : Array.from(val);
}

/**
 * Get values of an Enum
 */
export const getEnumStringValues = <T extends any>(SomeEnum: Record<string, T>): T[] => {
    const enumValues: Array<T> = [];
    for (const value in SomeEnum) {
        if (typeof SomeEnum[value] !== "number") enumValues.push(SomeEnum[value]);
    }
    return enumValues;
};
