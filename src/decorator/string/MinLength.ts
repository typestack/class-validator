import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import {length} from "./Length";

export const MIN_LENGTH = "minLength";

/**
 * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export function minLength(value: string, min: number) {
    return typeof value === "string" && length(value, min);
}

/**
 * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
 */
export function MinLength(min: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: MIN_LENGTH,
            validate: (value, args) => minLength(value, args.constraints[0]),
            constraints: [min],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be longer than or equal to $constraint1 characters", validationOptions)
        },
        validationOptions
    );
}
