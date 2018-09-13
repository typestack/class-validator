import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {getFromContainer, MetadataStorage, ValidationTypes} from "..";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {equals} from "./Equals";

/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
export function isEmpty(value: any): boolean {
    return value === "" || value === null || value === undefined;
}

/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
export function IsEmpty(validationOptions?: ValidationOptions) {
    return ValidateBy({
        name: "isEmpty",
        validate: (value, args) => isEmpty(value),
        defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be empty", validationOptions),

    }, validationOptions);
}
