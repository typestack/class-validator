import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_MAX_SIZE = "arrayMaxSize";

/**
 * Checks if array's length is as maximal this number.
 * If null or undefined is given then this function returns false.
 */
export function arrayMaxSize(array: any[], max: number) {
    if (!(array instanceof Array)) {
        return false;
    }

    return array instanceof Array && array.length <= max;
}

/**
 * Checks if array's length is as maximal this number.
 */
export function ArrayMaxSize(max: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_MAX_SIZE,
            validate: (value, args) => arrayMaxSize(value, args.constraints[0]),
            constraints: [max],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain not more than $constraint1 elements", validationOptions)
        },
        validationOptions
    );
}
