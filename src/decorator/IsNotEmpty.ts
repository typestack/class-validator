import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

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
        name: "isNotEmpty",
        validate: (value, args) => isNotEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be empty", validationOptions),

    }, validationOptions);
}
