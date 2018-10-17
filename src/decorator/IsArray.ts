import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";


/**
 * Checks if a given value is an array
 */
export function isArray(value: any): boolean {
    return value instanceof Array;
}

/**
 * Checks if a value is an array.
 */
export function IsArray(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isArray",
            validate: (value) => isArray(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an array", validationOptions)
        },
        validationOptions
    );
}
