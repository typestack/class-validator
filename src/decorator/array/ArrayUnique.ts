import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_UNIQUE = "arrayUnique";

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function arrayUnique(array: any[]) {
    if (!(array instanceof Array)) {
        return false;
    }

    const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
    return array.length === uniqueItems.length;
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
export function ArrayUnique(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_UNIQUE,
            validate: (value) => arrayUnique(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "All $property's elements must be unique", validationOptions)
        },
        validationOptions
    );
}
