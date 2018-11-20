import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_NOT_IN = "isNotIn";

/**
 * Checks if given value not in a array of allowed values.
 */
export function isNotIn(value: any, possibleValues: any[]): boolean {
    return !(possibleValues instanceof Array) || !possibleValues.some(possibleValue => possibleValue === value);
}

/**
 * Checks if value is not in a array of disallowed values.
 */
export function IsNotIn(values: any[], validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_NOT_IN,
            validate: (value, args) => isNotIn(value, args.constraints[0]),
            constraints: [values],
            defaultMessage: buildMessage(
                (eachPrefix) => eachPrefix + "$property should not be one of the following values: $constraint1",
                validationOptions),

        },
        validationOptions
    );
}
