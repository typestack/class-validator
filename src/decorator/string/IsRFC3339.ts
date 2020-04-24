import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validator from "validator";

export const IS_RFC_3339 = "isRFC3339";

/**
 * Check if the string is a valid RFC 3339 date.
 * If given value is not a string, then it returns false.
 */
export function isRFC3339(value: unknown): boolean {
    return typeof value === "string" && validator.isRFC3339(value);
}

/**
 * Check if the string is a valid RFC 3339 date.
 * If given value is not a string, then it returns false.
 */
export function IsRFC3339(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_RFC_3339,
            validator: {
                validate: (value, args): boolean => isRFC3339(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be RFC 3339 date",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
