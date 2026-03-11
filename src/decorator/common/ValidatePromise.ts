import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

export const VALIDATE_PROMISE = 'validatePromise';

/**
 * Resolve promise before validation
 */
export function ValidatePromise(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      name: VALIDATE_PROMISE,
      type: ValidationTypes.PROMISE_VALIDATION,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
