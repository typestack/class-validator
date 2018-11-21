import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const IS_NOT_EMPTY = "isNotEmpty";

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export function isNotEmpty(value: any): boolean {
    return value !== "" && value !== null && value !== undefined;
}

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export function IsNotEmpty(validationOptions?: ValidationOptions) {
    return ValidateBy({
        name: IS_NOT_EMPTY,
        validate: (value, args) => isNotEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be empty", validationOptions),

    }, validationOptions);
}
