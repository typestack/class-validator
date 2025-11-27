import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from './ValidateBy';
import { isLatLong } from './IsLatLong';

export const IS_LATITUDE = 'isLatitude';

/**
 * Checks if a given value is a latitude.
 */
export function isLatitude(value: number | string): boolean {
  return (typeof value === 'number' || typeof value === 'string') && isLatLong(`${value},0`);
}

/**
 * Checks if a given value is a latitude.
 */
export function IsLatitude(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_LATITUDE,
      validator: {
        validate: (value, args): boolean => isLatitude(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a latitude string or number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
