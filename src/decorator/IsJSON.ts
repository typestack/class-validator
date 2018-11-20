import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsJSON = require("validator/lib/isJSON");

export const IS_JSON = "isJson";

/**
 * Checks if the string is valid JSON (note: uses JSON.parse).
 * If given value is not a string, then it returns false.
 */
export function isJSON(value: string): boolean {
    return typeof value === "string" && validatorJsIsJSON(value);
}

/**
 * Checks if the string is valid JSON (note: uses JSON.parse).
 */
export function IsJSON(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_JSON,
            validate: (value) => isJSON(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a json string", validationOptions)
        },
        validationOptions
    );
}
