import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateNested(validationOptions?: ValidationOptions): PropertyDecorator {
  const opts: ValidationOptions = { ...validationOptions };
  const eachPrefix = opts.each ? 'each value in ' : '';
  opts.message = opts.message || eachPrefix + 'nested property $property must be either object or array';

  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      name: 'ValidateNested',
      type: ValidationTypes.NESTED_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: opts,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
