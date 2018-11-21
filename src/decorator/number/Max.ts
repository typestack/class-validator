import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const MAX = "max";

/**
 * Checks if the first number is less than or equal to the second/reference.
 */
export function max(num: number, reference: number): boolean {
    return typeof num === "number" && typeof reference === "number" && num <= reference;
}

/**
 * Checks if the given number is less than or equal to the reference number.
 */
export function Max(reference: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: MAX,
            validate: (value, args) => max(value, args.constraints[0]),
            constraints: [reference],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must not be greater than $constraint1", validationOptions)
        },
        validationOptions
    );
}
