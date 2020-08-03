import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_NEGATIVE = 'isNegative';

/**
 * Checks if the value is a negative number smaller than zero.
 */
export function isNegative(value: unknown): boolean {
  return typeof value === 'number' && value < 0;
}

/**
 * Checks if the value is a negative number smaller than zero.
 */
export function IsNegative(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NEGATIVE,
      validator: {
        validate: (value, args): boolean => isNegative(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a negative number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
