import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {length} from "./Length";

export const MAX_LENGTH = "maxLength";

/**
 * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export function maxLength(value: string, max: number) {
    return typeof value === "string" && length(value, 0, max);
}

/**
 * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
 */
export function MaxLength(max: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: MAX_LENGTH,
            validate: (value, args) => maxLength(value, args.constraints[0]),
            constraints: [max],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be shorter than or equal to $constraint1 characters", validationOptions)
        },
        validationOptions
    );
}
