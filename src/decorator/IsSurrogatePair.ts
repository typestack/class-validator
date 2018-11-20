import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsSurrogatePair = require("validator/lib/isSurrogatePair");

export const IS_SURROGATE_PAIR = "isSurrogatePair";

/**
 * Checks if the string contains any surrogate pairs chars.
 * If given value is not a string, then it returns false.
 */
export function isSurrogatePair(value: string): boolean {
    return typeof value === "string" && validatorJsIsSurrogatePair(value);
}


/**
 * Checks if the string contains any surrogate pairs chars.
 */
export function IsSurrogatePair(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_SURROGATE_PAIR,
            validate: (value) => isSurrogatePair(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain any surrogate pairs chars", validationOptions)
        },
        validationOptions
    );
}
