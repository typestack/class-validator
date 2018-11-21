import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_CONTAINS = "arrayContains";

/**
 * Checks if array contains all values from the given array of values.
 * If null or undefined is given then this function returns false.
 */
export function arrayContains(array: any[], values: any[]) {
    if (!(array instanceof Array)) {
        return false;
    }

    return !array || values.every(value => array.indexOf(value) !== -1);
}

/**
 * Checks if array contains all values from the given array of values.
 */
export function ArrayContains(values: any[], validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_CONTAINS,
            validate: (value, args) => arrayContains(value, args.constraints[0]),
            constraints: [values],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain $constraint1 values", validationOptions)
        },
        validationOptions
    );
}
