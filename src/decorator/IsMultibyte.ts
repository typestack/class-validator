import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsMultibyte = require("validator/lib/isMultibyte");

export const IS_MULTIBYTE = "isMultibyte";

/**
 * Checks if the string contains one or more multibyte chars.
 * If given value is not a string, then it returns false.
 */
export function isMultibyte(value: string): boolean {
    return typeof value === "string" && validatorJsIsMultibyte(value);
}


/**
 * Checks if the string contains one or more multibyte chars.
 */
export function IsMultibyte(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_MULTIBYTE,
            validate: (value) => isMultibyte(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain one or more multibyte chars", validationOptions)
        },
        validationOptions
    );
}
