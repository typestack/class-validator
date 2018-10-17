import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if the value is a negative number.
 */
export function isNegative(value: number): boolean {
    return typeof value === "number" && value < 0;
}

/**
 * Checks if the value is a negative number.
 */
export function IsNegative(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isNegative",
            validate: (value) => isNegative(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a negative number", validationOptions)
        },
        validationOptions
    );
}
