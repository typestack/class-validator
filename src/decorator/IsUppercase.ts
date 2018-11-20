import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsUppercase = require("validator/lib/isUppercase");

export const IS_UPPERCASE = "isUppercase";

/**
 * Checks if the string is uppercase.
 * If given value is not a string, then it returns false.
 */
export function isUppercase(value: string): boolean {
    return typeof value === "string" && validatorJsIsUppercase(value);
}


/**
 * Checks if the string is uppercase.
 */
export function IsUppercase(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_UPPERCASE,
            validate: (value) => isUppercase(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be uppercase", validationOptions)
        },
        validationOptions
    );
}
