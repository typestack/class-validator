import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsBase64 = require("validator/lib/isBase64");

export const IS_BASE64 = "isBase64";

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function isBase64(value: string): boolean {
    return typeof value === "string" && validatorJsIsBase64(value);
}

/**
 * Checks if a string is base64 encoded.
 */
export function IsBase64(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_BASE64,
            validate: (value) => isBase64(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be base64 encoded", validationOptions)
        },
        validationOptions
    );
}
