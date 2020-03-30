import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "./ValidateBy";
import validatorJsIsLatLong from "validator/lib/isLatLong";

export const IS_LATLONG = "isLatLong";

/**
 * Checks if a value is string in format a "latitude,longitude".
 */
export function isLatLong(value: string): boolean {
    return typeof value === "string" && validatorJsIsLatLong(value);
}

/**
 * Checks if a value is string in format a "latitude,longitude".
 */
export function IsLatLong(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_LATLONG,
            validator: {
                validate: (value, args) => isLatLong(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a latitude,longitude string",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
