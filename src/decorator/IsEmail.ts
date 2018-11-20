import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsEmail = require("validator/lib/isEmail");

export const IS_EMAIL = "isEmail";

/**
 * Checks if the string is an email.
 * If given value is not a string, then it returns false.
 */
export function isEmail(value: string, options?: ValidatorJS.IsEmailOptions): boolean {
    return typeof value === "string" && validatorJsIsEmail(value, options);
}

/**
 * Checks if the string is an email.
 */
export function IsEmail(options?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_EMAIL,
            validate: (value, args) => isEmail(value, args.constraints[0]),
            constraints: [options],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an email", validationOptions)
        },
        validationOptions
    );
}
