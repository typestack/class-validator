import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsAlphanumeric = require("validator/lib/isAlphanumeric");

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function isAlphanumeric(value: string): boolean {
    return typeof value === "string" && validatorJsIsAlphanumeric(value);
}


/**
 * Checks if the string contains only letters and numbers.
 */
export function IsAlphanumeric(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isAlphanumeric",
            validate: (value) => isAlphanumeric(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain only letters and numbers", validationOptions)
        },
        validationOptions
    );
}
