import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_POSITIVE = "isPositive";

/**
 * Checks if the value is a positive number.
 */
export function isPositive(value: number): boolean {
    return typeof value === "number" && value > 0;
}

/**
 * Checks if the value is a positive number.
 */
export function IsPositive(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_POSITIVE,
            validate: (value) => isPositive(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a positive number", validationOptions)
        },
        validationOptions
    );
}
