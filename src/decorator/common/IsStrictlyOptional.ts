import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

export const IS_STRICTLY_OPTIONAL = 'isStrictlyOptional';

/**
 * Checks if value is missing (undefined) and if so, ignores all validators.
 */
export function IsStrictlyOptional(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      name: IS_STRICTLY_OPTIONAL,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [
        (object: any, value: any): boolean => {
          return object[propertyName] !== undefined;
        },
      ],
      validationOptions: validationOptions,
    };
    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
