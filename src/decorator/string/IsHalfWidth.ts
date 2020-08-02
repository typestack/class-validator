import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isHalfWidthValidator from 'validator/es/lib/isHalfWidth';

export const IS_HALF_WIDTH = 'isHalfWidth';

/**
 * Checks if the string contains any half-width chars.
 * If given value is not a string, then it returns false.
 */
export function isHalfWidth(value: unknown): boolean {
  return typeof value === 'string' && isHalfWidthValidator(value);
}

/**
 * Checks if the string contains any full-width chars.
 * If given value is not a string, then it returns false.
 */
export function IsHalfWidth(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_HALF_WIDTH,
      validator: {
        validate: (value, args): boolean => isHalfWidth(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must contain a half-width characters',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
