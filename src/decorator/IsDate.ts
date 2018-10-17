import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if a given value is a real date.
 */
export function isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Checks if a value is a date.
 */
export function IsDate(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isDate",
            validate: (value) => isDate(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a Date instance", validationOptions)
        },
        validationOptions
    );
}
