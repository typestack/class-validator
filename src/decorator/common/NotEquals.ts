import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const NOT_EQUALS = "notEquals";

/**
 * Checks if value does not match ("!==") the comparison.
 */
export function notEquals(value: any, comparison: any): boolean {
    return value !== comparison;
}

/**
 * Checks if the value does not match ("!==") the comparison.
 */
export function NotEquals(comparison: any, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: NOT_EQUALS,
            constraints: [comparison],
            validate: (value, args) => notEquals(value, args.constraints[0]),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be equal to $constraint1", validationOptions)
        },
        validationOptions);
}
