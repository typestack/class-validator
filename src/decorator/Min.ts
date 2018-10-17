import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if the first number is greater than or equal to the second/reference.
 */
export function min(num: number, reference: number): boolean {
    return typeof num === "number" && typeof reference === "number" && num >= reference;
}

/**
 * Checks if the given number is greater than or equal to reference number.
 */
export function Min(reference: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "min",
            validate: (value, args) => min(value, args.constraints[0]),
            constraints: [reference],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must not be less than $constraint1", validationOptions)
        },
        validationOptions
    );
}
