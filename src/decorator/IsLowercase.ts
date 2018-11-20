import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsLowercase = require("validator/lib/isLowercase");

export const IS_LOWERCASE = "isLowercase";

/**
 * Checks if the string is lowercase.
 * If given value is not a string, then it returns false.
 */
export function isLowercase(value: string): boolean {
    return typeof value === "string" && validatorJsIsLowercase(value);
}

/**
 * Checks if the string is lowercase.
 */
export function IsLowercase(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_LOWERCASE,
            validate: (value) => isLowercase(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a lowercase string", validationOptions)
        },
        validationOptions
    );
}
