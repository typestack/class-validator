import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_EMPTY = "isEmpty";

/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
export function isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
}

/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
export function IsEmpty(validationOptions?: ValidationOptions) {
    return ValidateBy({
        name: IS_EMPTY,
        validate: (value, args) => isEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be empty", validationOptions),

    }, validationOptions);
}
