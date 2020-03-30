import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import ValidatorJS from "validator";

export const IS_MAC_ADDRESS = "isMacAddress";

/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
export function isMACAddress(value: unknown, options?: ValidatorJS.IsMACAddressOptions): boolean {
    return typeof value === "string" && ValidatorJS.isMACAddress(value, options);
}

/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
// TODO: breaking change new options
export function IsMACAddress(options?: ValidatorJS.IsMACAddressOptions, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_MAC_ADDRESS,
            constraints: [options],
            validator: {
                validate: (value, args) => isMACAddress(value, options),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a MAC Address",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
