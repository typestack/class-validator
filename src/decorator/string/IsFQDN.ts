import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsFQDN = require("validator/lib/isFQDN");

export const IS_FQDN = "isFqdn";

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export function isFQDN(value: string, options?: ValidatorJS.IsFQDNOptions): boolean {
    return typeof value === "string" && validatorJsIsFQDN(value, options);
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsFQDN(options?: ValidatorJS.IsFQDNOptions, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_FQDN,
            validate: (value, args) => isFQDN(value, args.constraints[0]),
            constraints: [options],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a valid domain name", validationOptions)
        },
        validationOptions
    );
}
