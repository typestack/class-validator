import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsURL = require("validator/lib/isURL");

export const IS_URL = "isUrl";

/**
 * Checks if the string is an url.
 * If given value is not a string, then it returns false.
 */
export function isURL(value: string, options?: ValidatorJS.IsURLOptions): boolean {
    return typeof value === "string" && validatorJsIsURL(value, options);
}

/**
 * Checks if the string is an url.
 */
export function IsUrl(options?: ValidatorJS.IsURLOptions, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_URL,
            validate: (value, args) => isURL(value, args.constraints[0]),
            constraints: [options],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an URL address", validationOptions)
        },
        validationOptions
    );
}
