import {buildMessage, ValidateBy} from "../ValidateBy";
import {ValidationOptions} from "../ValidationOptions";
import validatorJsContains = require("validator/lib/contains");

export const CONTAINS = "contains";

/**
 * Checks if the string contains the seed.
 * If given value is not a string, then it returns false.
 */
export function contains(value: string, seed: string): boolean {
    return typeof value === "string" && validatorJsContains(value, seed);
}

/**
 * Checks if the string contains the seed.
 */
export function Contains(seed: string, validationOptions?: ValidationOptions) {

    return ValidateBy({
            name: CONTAINS,
            validate: (value, args) => contains(value, args.constraints[0]),
            constraints: [seed],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must contain a $constraint1 string", validationOptions),
        },
        validationOptions
    );
}
