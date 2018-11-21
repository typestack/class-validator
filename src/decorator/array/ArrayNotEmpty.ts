import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_NOT_EMPTY = "arrayNotEmpty";

/**
 * Checks if given array is not empty.
 * If null or undefined is given then this function returns false.
 */
export function arrayNotEmpty(array: any[]) {
    if (!(array instanceof Array)) {
        return false;
    }

    return array instanceof Array && array.length > 0;
}

/**
 * Checks if given array is not empty.
 */
export function ArrayNotEmpty(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_NOT_EMPTY,
            validate: (value) => arrayNotEmpty(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be empty", validationOptions)
        },
        validationOptions
    );
}
