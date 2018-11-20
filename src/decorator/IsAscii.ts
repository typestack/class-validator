import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsAscii = require("validator/lib/isAscii");

export const IS_ASCII = "isAscii";

/**
 * Checks if the string contains ASCII chars only.
 * If given value is not a string, then it returns false.
 */
export function isAscii(value: string): boolean {
    return typeof value === "string" && validatorJsIsAscii(value);
}

/**
 * Checks if the string contains ASCII chars only.
 */
export function IsAscii(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_ASCII,
            validate: (value) => isAscii(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain only ASCII characters", validationOptions)
        },
        validationOptions
    );
}
