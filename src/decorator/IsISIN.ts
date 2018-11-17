import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsISIN = require("validator/lib/isISIN");


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
            name: "isIsin",
            validate: (value) => isISIN(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an ISIN (stock/security identifier)", validationOptions)
        },
        validationOptions
    );
}
