import { getMetadataStorage } from "../../metadata/MetadataStorage";
import { ValidationMetadata } from "../../metadata/ValidationMetadata";
import { ValidationMetadataArgs } from "../../metadata/ValidationMetadataArgs";
import { ValidationTypes } from "../../validation/ValidationTypes";
import { ValidationOptions } from "../ValidationOptions";

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateNested(validationOptions?: ValidationOptions): PropertyDecorator {
    const opts: ValidationOptions = { ...validationOptions };
    const eachPrefix = opts.each ? "each value in " : "";
    opts.message = opts.message || eachPrefix + "nested property $property must be either object or array";

    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NESTED_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: opts,
        };
        getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
    };
}

export function ValidateNestedIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions): PropertyDecorator {
    const opts: ValidationOptions = { ...validationOptions };
    const eachPrefix = opts.each ? "each value in " : "";
    opts.message = opts.message || eachPrefix + "nested property $property must be either object or array";

    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NESTED_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [condition],
            validationOptions: opts,
        };
        getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
    };
}
