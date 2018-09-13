import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {getFromContainer, MetadataStorage, ValidationTypes} from "..";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {equals} from "./Equals";

/**
 * Checks if a given value is a real boolean.
 */
export function isBoolean(value: any): boolean {
    return value instanceof Boolean || typeof value === "boolean";
}


/**
 * Checks if a value is a boolean.
 */
export function IsBoolean(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isBoolean",
            validate: (value, args) => isBoolean(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a boolean value", validationOptions),

        },
        validationOptions
    );
}
