import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsISO8601 = require("validator/lib/isISO8601");

export const IS_ISO8601 = "isIso8601";


/**
 * Checks if the string is a valid ISO 8601 date.
 * If given value is not a string, then it returns false.
 */
export function isISO8601(value: string): boolean {
    return typeof value === "string" && validatorJsIsISO8601(value);
}


/**
 * Checks if the string is a valid ISO 8601 date.
 */
export function IsISO8601(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_ISO8601,
            validate: (value) => isISO8601(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a valid ISO 8601 date string", validationOptions)
        },
        validationOptions
    );
}
