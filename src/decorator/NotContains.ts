import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {contains} from "./Contains";

export const NOT_CONTAINS = "notContains";

/**
 * Checks if the string does not contain the seed.
 * If given value is not a string, then it returns false.
 */
export function notContains(value: string, seed: string): boolean {
    return typeof value === "string" && !contains(value, seed);
}

/**
 * Checks if the string does not contain the seed.
 */
export function NotContains(seed: string, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: NOT_CONTAINS,
            validate: (value, args) => notContains(value, args.constraints[0]),
            constraints: [seed],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not contain a $constraint1 string", validationOptions)
        },
        validationOptions
    );
}
