import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
// strange module export :(
const validatorJsIsHalfWidth: (value: any) => boolean = require("validator/lib/isHalfWidth").default;

export const IS_HALF_WIDTH = "isHalfWidth";

/**
 * Checks if the string contains any half-width chars.
 * If given value is not a string, then it returns false.
 */
export function isHalfWidth(value: string): boolean {
    return typeof value === "string" && validatorJsIsHalfWidth(value);
}

/**
 * Checks if the string contains any half-width chars.
 */
export function IsHalfWidth(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_HALF_WIDTH,
            validate: (value) => isHalfWidth(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain a half-width characters", validationOptions)
        },
        validationOptions
    );
}
