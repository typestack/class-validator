import { ValidationArguments } from '../../validation/ValidationArguments';
import { ValidationOptions } from '../ValidationOptions';
import { ValidateBy, buildMessage } from './ValidateBy';

export const IS_MUTUALLY_EXCLUSIVE_WITH = 'isMutuallyExclusiveWith';

/**
 * Checks if the value and the value of the related property are not both present at the same time.
 */
export function isMutuallyExclusiveWith(
  value: unknown,
  relatedPropertyName: string,
  args?: ValidationArguments
): boolean {
  const relatedValue = (args?.object as any)?.[relatedPropertyName];
  const isValuePresent = value !== undefined && value !== null;
  const isRelatedPresent = relatedValue !== undefined && relatedValue !== null;
  return !(isValuePresent && isRelatedPresent);
}

/**
 * Checks if the property and the given related property are not both provided at the same time.
 */
export function IsMutuallyExclusiveWith(property: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_MUTUALLY_EXCLUSIVE_WITH,
      constraints: [property],
      validator: {
        validate: (value, args): boolean => isMutuallyExclusiveWith(value, args?.constraints[0], args),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + `$property and ${property} cannot both be provided`,
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
