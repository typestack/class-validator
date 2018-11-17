import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsHexadecimal = require("validator/lib/isHexadecimal");


/**
 * Checks if the string is a hexadecimal number.
 * If given value is not a string, then it returns false.
 */
export function isHexadecimal(value: string): boolean {
    return typeof value === "string" && validatorJsIsHexadecimal(value);
}

/**
 * Checks if the string is a hexadecimal number.
 */
export function IsHexadecimal(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isHexadecimal",
            validate: (value) => isHexadecimal(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a hexadecimal number", validationOptions)
        },
        validationOptions
    );
}
