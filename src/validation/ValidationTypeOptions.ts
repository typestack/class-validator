/**
 * Options to be passed to IsNumber decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
    maxDecimalPlaces?: number;
}
