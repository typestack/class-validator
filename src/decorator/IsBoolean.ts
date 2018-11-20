import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_BOOLEAN = "isBoolean";

/**
 * Checks if a given value is a real boolean.
 */
export function isBoolean(value: any): boolean {
    return value instanceof Boolean || typeof value === "boolean";
}

/**
 * Checks if a value is a boolean.
 */
export function IsBoolean(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_BOOLEAN,
            validate: (value) => isBoolean(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a boolean value", validationOptions)
        },
        validationOptions
    );
}
