import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsISIN = require("validator/lib/isISIN");

export const IS_ISIN = "isIsin";

/**
 * Checks if the string is an ISIN (stock/security identifier).
 * If given value is not a string, then it returns false.
 */
export function isISIN(value: string): boolean {
    return typeof value === "string" && validatorJsIsISIN(value);
}

/**
 * Checks if the string is an ISIN (stock/security identifier).
 */
export function IsISIN(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_ISIN,
            validate: (value) => isISIN(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an ISIN (stock/security identifier)", validationOptions)
        },
        validationOptions
    );
}
