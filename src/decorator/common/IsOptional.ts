import { ValidationOptions } from '../ValidationOptions';
import { ValidationMetadataArgs } from '../../metadata/ValidationMetadataArgs';
import { ValidationTypes } from '../../validation/ValidationTypes';
import { ValidationMetadata } from '../../metadata/ValidationMetadata';
import { getMetadataStorage } from '../../metadata/MetadataStorage';

type IsOptionalCondition = (object: any, value: any) => boolean;

export function IsOptional(condition: IsOptionalCondition, validationOptions?: ValidationOptions): PropertyDecorator;
export function IsOptional(validationOptions?: ValidationOptions): PropertyDecorator;

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export function IsOptional(
  condition?: IsOptionalCondition | ValidationOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string): void {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      propertyName,
      constraints: [
        (object: any, value: any): boolean => {
          if (typeof condition === 'function') {
            if (!condition(object, value)) {
              return true;
            }
          }

          return object[propertyName] !== null && object[propertyName] !== undefined;
        },
      ],
      validationOptions: typeof condition === 'object' ? condition : validationOptions,
    };

    getMetadataStorage().addValidationMetadata(new ValidationMetadata(args));
  };
}
