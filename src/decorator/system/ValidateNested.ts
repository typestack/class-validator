import {ValidationOptions} from "../ValidationOptions";
import {ValidationMetadataArgs} from "../../metadata/ValidationMetadataArgs";
import {ValidationTypes} from "../../validation/ValidationTypes";
import {getFromContainer} from "../../container";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateNested(validationOptions?: ValidationOptions) {
    const opts: ValidationOptions = {...validationOptions};
    const eachPrefix = opts.each ? "each value in " : "";
    opts.message = opts.message || eachPrefix + "nested property $property must be either object or array";

    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NESTED_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: opts,
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
