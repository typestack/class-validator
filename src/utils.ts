// https://github.com/TylorS/typed-is-promise/blob/abf1514e1b6961adfc75765476b0debb96b2c3ae/src/index.ts

export function isPromise<T>(p: any): p is Promise<T>;
export function isPromise(p: any): p is Promise<any>;

export function isPromise<T>(p: any): p is Promise<T> {
    return p !== null && typeof p === "object" && typeof p.then === "function";
}
