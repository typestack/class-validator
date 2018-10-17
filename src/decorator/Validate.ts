import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {MetadataStorage} from "../metadata/MetadataStorage";
import {ValidationTypes} from "../validation/ValidationTypes";
import {getFromContainer} from "../container";

/**
 * Performs validation based on the given custom validation class.
 * Validation class must be decorated with ValidatorConstraint decorator.
 */
export function Validate(constraintClass: Function, validationOptions?: ValidationOptions): Function;
export function Validate(constraintClass: Function, constraints?: any[], validationOptions?: ValidationOptions): Function;
export function Validate(constraintClass: Function, constraintsOrValidationOptions?: any[] | ValidationOptions, maybeValidationOptions?: ValidationOptions): Function {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CUSTOM_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraintCls: constraintClass,
            constraints: constraintsOrValidationOptions instanceof Array ? constraintsOrValidationOptions as any[] : undefined,
            validationOptions: !(constraintsOrValidationOptions instanceof Array) ? constraintsOrValidationOptions as ValidationOptions : maybeValidationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
