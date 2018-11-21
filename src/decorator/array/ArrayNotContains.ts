import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_NOT_CONTAINS = "arrayNotContains";

/**
 * Checks if array does not contain any of the given values.
 * If null or undefined is given then this function returns false.
 */
export function arrayNotContains(array: any[], values: any[]) {
    if (!(array instanceof Array)) {
        return false;
    }

    return !array || values.every(value => array.indexOf(value) === -1);
}

/**
 * Checks if array does not contain any of the given values.
 */
export function ArrayNotContains(values: any[], validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_NOT_CONTAINS,
            validate: (value, args) => arrayNotContains(value, args.constraints[0]),
            constraints: [values],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not contain $constraint1 values", validationOptions)
        },
        validationOptions
    );
}
