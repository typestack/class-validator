import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {getFromContainer, MetadataStorage, ValidationTypes} from "..";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {equals} from "./Equals";

/**
 * Checks if given value not in a array of allowed values.
 */
export function isNotIn(value: any, possibleValues: any[]): boolean {
    return !(possibleValues instanceof Array) || !possibleValues.some(possibleValue => possibleValue === value);
}

/**
 * Checks if value is not in a array of disallowed values.
 */
export function IsNotIn(values: any[], validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isNotIn",
            validate: (value, args) => isNotIn(value, args.constraints[0]),
            constraints: [values],
            defaultMessage: buildMessage(
                (eachPrefix) => eachPrefix + "$property should not be one of the following values: $constraint1",
                validationOptions),

        },
        validationOptions
    );
}
