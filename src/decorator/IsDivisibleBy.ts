import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import * as validatorIsDivisibleBy from "validator/lib/isDivisibleBy";

export const IS_DIVISIBLE_BY = "isDivisibleBy";

/**
 * Checks if value is a number that's divisible by another.
 */
export function isDivisibleBy(value: number, num: number): boolean {
    return typeof value === "number" &&
        typeof num === "number" &&
        validatorIsDivisibleBy(String(value), num);
}

/**
 * Checks if the value is a number that's divisible by another.
 */
export function IsDivisibleBy(num: number, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_DIVISIBLE_BY,
            validate: (value, args) => isDivisibleBy(value, args.constraints[0]),
            constraints: [num],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be divisible by $constraint1", validationOptions)
        },
        validationOptions
    );
}
