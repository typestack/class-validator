import {buildMessage, ValidateBy} from "./ValidateBy";
import {ValidationOptions} from "./ValidationOptions";
import validatorJsIsBoolean = require("validator/lib/isBoolean");

export const IS_BOOLEAN_STRING = "isBooleanString";

/**
 * Checks if a string is a boolean.
 * If given value is not a string, then it returns false.
 */
export function isBooleanString(value: string): boolean {
    return typeof value === "string" && validatorJsIsBoolean(value);
}

/**
 * Checks if a string is a boolean.
 */
export function IsBooleanString(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_BOOLEAN_STRING,
            validate: (value) => isBooleanString(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + eachPrefix + "$property must be a boolean string", validationOptions)
        },
        validationOptions
    );
}
