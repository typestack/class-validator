import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if value matches ("===") the comparison.
 */
export function equals(value: any, comparison: any): boolean {
    return value === comparison;
}

/**
 * Checks if the value match ("===") the comparison.
 */
export function Equals(comparison: any, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "equals",
            validate: (value, args) => equals(value, args.constraints[0]),
            constraints: [comparison],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be equal to $constraint1", validationOptions),

        },
        validationOptions
    );
}

