import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsNumeric = require("validator/lib/isNumeric");

/**
 * Checks if the string is numeric.
 * If given value is not a string, then it returns false.
 */
export function isNumberString(value: string, options?: ValidatorJS.IsNumericOptions): boolean {
    return typeof value === "string" && validatorJsIsNumeric(value, options);
}

/**
 * Checks if the string is a number.
 */
export function IsNumberString(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isNumberString",
            validate: (value) => isNumberString(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a number string", validationOptions)
        },
        validationOptions
    );
}
