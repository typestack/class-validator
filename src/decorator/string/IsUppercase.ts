import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validatorJsIsUppercase from "validator/lib/isUppercase";

export const IS_UPPERCASE = "isUppercase";

/**
 * Checks if the string is uppercase.
 * If given value is not a string, then it returns false.
 */
export function isUppercase(value: unknown): boolean {
    return typeof value === "string" && validatorJsIsUppercase(value);
}

/**
 * Checks if the string is uppercase.
 * If given value is not a string, then it returns false.
 */
export function IsUppercase(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_UPPERCASE,
            validator: {
                validate: (value, args) => isUppercase(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be uppercase",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
