import { ConstraintMetadata } from './metadata/ConstraintMetadata';
import { ValidatorConstraintInterface } from './validation/ValidatorConstraintInterface';
import { ValidationMetadata } from './metadata/ValidationMetadata';
import { ValidationMetadataArgs } from './metadata/ValidationMetadataArgs';
import { ValidationTypes } from './validation/ValidationTypes';
import { ValidationArguments } from './validation/ValidationArguments';
import { getFromContainer } from './container';
import { MetadataStorage, getMetadataStorage } from './metadata/MetadataStorage';
import { ValidationOptions } from './decorator/ValidationOptions';

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
  options?: ValidationOptions;

  /**
   * Array of validation constraints.
   */
  constraints?: any[];

  /**
   * Validator that performs validation.
   */
  validator: ValidatorConstraintInterface | Function;
}

/**
 * Registers a custom validation decorator.
 */
export function registerDecorator(options: ValidationDecoratorOptions): void {
  let constraintCls: Function;
  if (options.validator instanceof Function) {
    constraintCls = options.validator;
    const constraintClasses = getFromContainer(MetadataStorage).getTargetValidatorConstraints(options.validator);
    if (constraintClasses.length > 1) {
      throw `More than one implementation of ValidatorConstraintInterface found for validator on: ${options.target.name}:${options.propertyName}`;
    }
  } else {
    const validator = options.validator;
    constraintCls = class CustomConstraint implements ValidatorConstraintInterface {
      validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return validator.validate(value, validationArguments);
      }

      defaultMessage(validationArguments?: ValidationArguments): string {
        if (validator.defaultMessage) {
          return validator.defaultMessage(validationArguments);
        }

        return '';
      }
    };
    getMetadataStorage().addConstraintMetadata(new ConstraintMetadata(constraintCls, options.name, options.async));
  }

  const validationMetadataArgs: ValidationMetadataArgs = {
    name: options.name,
    type: options.name && ValidationTypes.isValid(options.name) ? options.name : ValidationTypes.CUSTOM_VALIDATION,
    target: options.target,
    propertyName: options.propertyName,
    validationOptions: options.options,
    constraintCls: constraintCls,
    constraints: options.constraints,
  };
  getMetadataStorage().addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
}
