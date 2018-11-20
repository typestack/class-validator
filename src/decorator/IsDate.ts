import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

export const IS_DATE = "isDate";

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
            name: IS_DATE,
            validate: (value) => isDate(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a Date instance", validationOptions)
        },
        validationOptions
    );
}
