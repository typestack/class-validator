import {ValidationOptions} from "../ValidationOptions";
import {ValidationMetadataArgs} from "../../metadata/ValidationMetadataArgs";
import {ValidationTypes} from "../../validation/ValidationTypes";
import {getFromContainer} from "../../container";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [condition],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
