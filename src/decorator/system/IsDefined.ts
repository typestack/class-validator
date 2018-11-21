import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import {ValidationTypes} from "../../validation/ValidationTypes";

// isDefined is (yet) a special case
export const IS_DEFINED = ValidationTypes.IS_DEFINED;

/**
 * Checks if value is defined (!== undefined, !== null).
 */
export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
}


/**
 * Checks if given value is defined (!== undefined, !== null).
 */
export function IsDefined(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_DEFINED,
            validate: (value) => isDefined(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be null or undefined", validationOptions)
        },
        validationOptions
    );
}
