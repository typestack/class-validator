import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

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
        name: "isEmpty",
        validate: (value, args) => isEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be empty", validationOptions),

    }, validationOptions);
}
