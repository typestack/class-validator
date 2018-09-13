import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {getFromContainer, MetadataStorage, ValidationTypes} from "..";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {isEmpty} from "./IsEmpty";

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export function isNotEmpty(value: any): boolean {
    return value !== "" && value !== null && value !== undefined;
}

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export function IsNotEmpty(validationOptions?: ValidationOptions) {
    return ValidateBy({
        name: "isNotEmpty",
        validate: (value, args) => isNotEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property should not be empty", validationOptions),

    }, validationOptions);
}
