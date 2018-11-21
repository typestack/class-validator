import {ValidationOptions} from "../ValidationOptions";
import {ValidationMetadataArgs} from "../../metadata/ValidationMetadataArgs";
import {ValidationTypes} from "../../validation/ValidationTypes";
import {getFromContainer} from "../../container";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";


/**
 * If object has both allowed and not allowed properties a validation error will be thrown.
 */
export function Allow(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.WHITELIST,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
