import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validator from "validator";

export const IS_BASE64 = "isBase64";

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function isBase64(value: unknown): boolean {
    return typeof value === "string" && validator.isBase64(value);
}

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function IsBase64(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_BASE64,
            validator: {
                validate: (value, args): boolean => isBase64(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be base64 encoded",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
