import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

export const ALLOW = 'allow';

/**
 * If object has both allowed and not allowed properties a validation error will be thrown.
 */
export function Allow(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      name: ALLOW,
      type: ValidationTypes.WHITELIST,
      target: object.constructor,
      propertyName: propertyName,
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
