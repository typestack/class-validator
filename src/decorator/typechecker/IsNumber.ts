import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const IS_NUMBER = "isNumber";

/**
 * Options to be passed to IsNumber decorator.
 */
export interface IsNumberOptions {
    allowNaN?: boolean;
    allowInfinity?: boolean;
}

/**
 * Checks if a given value is a number.
 */
export function isNumber(value: any, options: IsNumberOptions = {}): boolean {
    if (value === Infinity || value === -Infinity) {
        return options.allowInfinity;
    }

    if (Number.isNaN(value)) {
        return options.allowNaN;
    }

    return Number.isFinite(value);
}

/**
 * Checks if a value is a number.
 */
export function IsNumber(options: IsNumberOptions = {}, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_NUMBER,
            validate: (value, args) => isNumber(value, args.constraints[0]),
            constraints: [options],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a number", validationOptions)
        },
        validationOptions
    );
}
