import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsCurrency = require("validator/lib/isCurrency");


/**
 * Checks if the string is a valid currency amount.
 * If given value is not a string, then it returns false.
 */
export function isCurrency(value: string, options?: ValidatorJS.IsCurrencyOptions): boolean {
    return typeof value === "string" && validatorJsIsCurrency(value, options);
}

/**
 * Checks if the string is a valid currency amount.
 */
export function IsCurrency(options?: ValidatorJS.IsCurrencyOptions, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isCurrency",
            validate: (value, args) => isCurrency(value, args.constraints[0]),
            constraints: [options],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a currency", validationOptions)
        },
        validationOptions
    );
}
