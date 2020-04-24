import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validator from "validator";

export const IS_OCTAL = "isOctal";

/**
 * Check if the string is a valid octal number.
 * If given value is not a string, then it returns false.
 */
export function isOctal(value: unknown): boolean {
    return typeof value === "string" && validator.isOctal(value);
}

/**
 * Check if the string is a valid octal number.
 * If given value is not a string, then it returns false.
 */
export function IsOctal(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_OCTAL,
            validator: {
                validate: (value, args): boolean => isOctal(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be valid octal number",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
