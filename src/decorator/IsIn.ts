import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_IN = "isIn";

/**
 * Checks if given value is in a array of allowed values.
 */
export function isIn(value: any, possibleValues: any[]): boolean {
    return !(possibleValues instanceof Array) || possibleValues.some(possibleValue => possibleValue === value);
}

/**
 * Checks if value is in a array of allowed values.
 */
export function IsIn(values: any[], validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_IN,
            constraints: [values],
            validate: (value, args) => isIn(value, args.constraints[0]),
            defaultMessage: buildMessage(
                (eachPrefix) => eachPrefix + "$property must be one of the following values: $constraint1",
                validationOptions),

        },
        validationOptions
    );
}
