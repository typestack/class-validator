import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if value is an integer.
 */
export function isInt(val: number): boolean {
    return Number.isInteger(val);
}

/**
 * Checks if the value is an integer number.
 */
export function IsInt(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isInt",
            validate: (value) => isInt(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an integer number", validationOptions)
        },
        validationOptions
    );
}
