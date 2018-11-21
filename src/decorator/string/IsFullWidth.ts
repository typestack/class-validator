import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
// strange module export :(
const validatorJsIsFullWidth: (value: any) => boolean = require("validator/lib/isFullWidth").default;

export const IS_FULL_WIDTH = "isFullWidth";

/**
 * Checks if the string contains any full-width chars.
 * If given value is not a string, then it returns false.
 */
export function isFullWidth(value: string): boolean {
    return typeof value === "string" && validatorJsIsFullWidth(value);
}

/**
 * Checks if the string contains any full-width chars.
 */
export function IsFullWidth(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_FULL_WIDTH,
            validate: (value) => isFullWidth(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain a full-width characters", validationOptions)
        },
        validationOptions
    );
}
