import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

export const IS_OPTIONAL = 'isOptional';

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      name: IS_OPTIONAL,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [
        (object: any, value: any): boolean => {
          return object[propertyName] !== null && object[propertyName] !== undefined;
        },
      ],
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
