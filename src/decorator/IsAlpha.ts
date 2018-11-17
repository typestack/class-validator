import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsAlpha = require("validator/lib/isAlpha");

/**
 * Checks if the string contains only letters (a-zA-Z).
 * If given value is not a string, then it returns false.
 */
export function isAlpha(value: string): boolean {
    return typeof value === "string" && validatorJsIsAlpha(value);
}


/**
 * Checks if the string contains only letters (a-zA-Z).
 */
export function IsAlpha(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isAlpha",
            validate: (value) => isAlpha(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain only letters (a-zA-Z)", validationOptions)
        },
        validationOptions
    );
}

