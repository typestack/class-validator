import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ConstraintMetadata } from '../../metadata/ConstraintMetadata';

/**
 * Registers custom validator class.
 */
export function ValidatorConstraint(options?: { name?: string; async?: boolean }) {
  return function (target: Function): void {
    const isAsync = options && options.async;
    let name = options && options.name ? options.name : '';
    if (!name) {
      name = (target as any).name;
      if (!name)
        // generate name if it was not given
        name = name.replace(/\.?([A-Z]+)/g, (x, y) => '_' + (y as string).toLowerCase()).replace(/^_/, '');
    }
    const metadata = new ConstraintMetadata(target, name, isAsync);
    getMetadataStorage().addConstraintMetadata(metadata);
  };
}

/**
 * Performs validation based on the given custom validation class.
 * Validation class must be decorated with ValidatorConstraint decorator.
 *
 * TODO: allow passing in a `name` so the validator instance created can be uniquely identified
 * until then, this validator will be overwritten by properties decorated with `Validate` on subclasses
 */
export function Validate(constraintClass: Function, validationOptions?: ValidationOptions): PropertyDecorator;
export function Validate(
  constraintClass: Function,
  constraints?: any[],
  validationOptions?: ValidationOptions
): PropertyDecorator;
export function Validate(
  constraintClass: Function,
  constraintsOrValidationOptions?: any[] | ValidationOptions,
  maybeValidationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      name: 'Validate',
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      constraintCls: constraintClass,
      constraints: Array.isArray(constraintsOrValidationOptions) ? constraintsOrValidationOptions : undefined,
      validationOptions: !Array.isArray(constraintsOrValidationOptions)
        ? constraintsOrValidationOptions
        : maybeValidationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
