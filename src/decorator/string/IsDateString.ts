import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";

export const IS_DATE_STRING = "isDateString";

/**
 * Checks if a given value is a ISOString date.
 */
export function isDateString(value: unknown): boolean {
    const regex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-][0-2]\d(?::[0-5]\d)?)?$/g;
    return typeof value === "string" && regex.test(value);
}

/**
 * Checks if a given value is a ISOString date.
 */
export function IsDateString(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_DATE_STRING,
            validator: {
                validate: (value, args): boolean => isDateString(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a ISOString",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
