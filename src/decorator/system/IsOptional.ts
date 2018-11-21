import {ValidationOptions} from "../ValidationOptions";
import {ValidationMetadataArgs} from "../../metadata/ValidationMetadataArgs";
import {ValidationTypes} from "../../validation/ValidationTypes";
import {getFromContainer} from "../../container";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export function IsOptional(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [(object: any, value: any) => {
                return object[propertyName] !== null && object[propertyName] !== undefined;
            }],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
