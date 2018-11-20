import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_INT = "isInt";

/**
 * Checks if value is an integer.
 */
export function isInt(val: number): boolean {
    return Number.isInteger(val);
}

/**
 * Checks if the value is an integer number.
 */
export function IsInt(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_INT,
            validate: (value) => isInt(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an integer number", validationOptions)
        },
        validationOptions
    );
}
