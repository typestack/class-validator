import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from './ValidateBy';
import { isLatLong } from './IsLatLong';

export const IS_LONGITUDE = 'isLongitude';

/**
 * Checks if a given value is a longitude.
 */
export function isLongitude(value: number | string): boolean {
  return (typeof value === 'number' || typeof value === 'string') && isLatLong(`0,${value}`);
}

/**
 * Checks if a given value is a longitude.
 */
export function IsLongitude(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_LONGITUDE,
      validator: {
        validate: (value, args): boolean => isLongitude(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a longitude string or number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
