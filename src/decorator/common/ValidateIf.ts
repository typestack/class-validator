import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

/**
 * Ignores the other validators on a property when the provided condition function returns false.
 */
export function ValidateIf(
  condition: (object: any, value: any, propertyName: string) => boolean,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [condition],
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
