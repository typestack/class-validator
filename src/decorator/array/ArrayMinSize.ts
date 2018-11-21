import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const ARRAY_MIN_SIZE = "arrayMinSize";

/**
 * Checks if array's length is as minimal this number.
 * If null or undefined is given then this function returns false.
 */
export function arrayMinSize(array: any[], min: number) {
    if (!(array instanceof Array)) {
        return false;
    }

    return array instanceof Array && array.length >= min;
}

/**
 * Checks if array's length is as minimal this number.
 */
export function ArrayMinSize(min: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: ARRAY_MIN_SIZE,
            validate: (value, args) => arrayMinSize(value, args.constraints[0]),
            constraints: [min],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain at least $constraint1 elements", validationOptions)
        },
        validationOptions
    );
}
