import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validator from "validator";

export const IS_PORT = "isPort";

/**
 * Check if the string is a valid port number.
 */
export function isPort(value: unknown): boolean {
    return typeof value === "string" && validator.isPort(value);
}

/**
 * Check if the string is a valid port number.
 */
export function IsPort(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_PORT,
            validator: {
                validate: (value, args): boolean => isPort(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a port",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
