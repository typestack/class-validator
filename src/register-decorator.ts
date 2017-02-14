import {ValidatorOptions} from "./validation/ValidatorOptions";
import {MetadataStorage} from "./metadata/MetadataStorage";
import {ConstraintMetadata} from "./metadata/ConstraintMetadata";
import {ValidatorConstraintInterface} from "./validation/ValidatorConstraintInterface";
import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {ValidationMetadataArgs} from "./metadata/ValidationMetadataArgs";
import {ValidationTypes} from "./validation/ValidationTypes";
import {ValidationArguments} from "./validation/ValidationArguments";
import {getFromContainer} from "./container";

export interface ValidationDecoratorOptions {

    /**
     * Target object to be validated.
     */
    target: Function;

    /**
     * Target object's property name to be validated.
     */
    propertyName: string;

    /**
     * Name of the validation that is being registered.
     */
    name?: string;

    /**
     * Indicates if this decorator will perform async validation.
     */
    async?: boolean;

    /**
     * Validator options.
     */
    options?: ValidatorOptions;

    /**
     * Array of validation constraints.
     */
    constraints?: any[];

    /**
     * Validator that performs validation.
     */
    validator: ValidatorConstraintInterface|Function;
}

/**
 * Registers a custom validation decorator.
 */
export function registerDecorator(options: ValidationDecoratorOptions): void {

    let constraintCls: Function;
    if (options.validator instanceof Function) {
        constraintCls = options.validator as Function;
    } else {
        const validator = options.validator as ValidatorConstraintInterface;
        constraintCls = class CustomConstraint implements ValidatorConstraintInterface {
            validate(value: any, validationArguments?: ValidationArguments): Promise<boolean>|boolean {
                return validator.validate(value, validationArguments);
            }

            defaultMessage(validationArguments?: ValidationArguments) {
                if (validator.defaultMessage) {
                    return validator.defaultMessage(validationArguments);
                }

                return "";
            }
        };
        getFromContainer(MetadataStorage).addConstraintMetadata(new ConstraintMetadata(constraintCls, options.name, options.async));
    }

    const validationMetadataArgs: ValidationMetadataArgs = {
        type: ValidationTypes.CUSTOM_VALIDATION,
        target: options.target,
        propertyName: options.propertyName,
        validationOptions: options.options,
        constraintCls: constraintCls,
        constraints: options.constraints
    };
    getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
}
