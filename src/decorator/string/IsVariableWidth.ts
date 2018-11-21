import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsVariableWidth = require("validator/lib/isVariableWidth");

export const IS_VARIABLE_WIDTH = "isVariableWidth";

/**
 * Checks if the string contains variable-width chars.
 * If given value is not a string, then it returns false.
 */
export function isVariableWidth(value: string): boolean {
    return typeof value === "string" && validatorJsIsVariableWidth(value);
}

/**
 * Checks if the string contains a mixture of full and half-width chars.
 */
export function IsVariableWidth(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_VARIABLE_WIDTH,
            validate: (value) => isVariableWidth(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain a full-width and half-width characters", validationOptions)
        },
        validationOptions
    );
}
