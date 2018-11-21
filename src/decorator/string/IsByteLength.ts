import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsByteLength = require("validator/lib/isByteLength");

export const IS_BYTE_LENGTH = "isByteLength";

/**
 * Checks if the string's length (in bytes) falls in a range.
 * If given value is not a string, then it returns false.
 */
export function isByteLength(value: string, min: number, max?: number): boolean {
    return typeof value === "string" && validatorJsIsByteLength(value, min, max);
}


/**
 * Checks if the string's length (in bytes) falls in a range.
 */
export function IsByteLength(min: number, max?: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_BYTE_LENGTH,
            validate: (value, args) => isByteLength(value, args.constraints[0], args.constraints[1]),
            constraints: [min, max],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property's byte length must fall into ($constraint1, $constraint2) range", validationOptions)
        },
        validationOptions
    );
}
