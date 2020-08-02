import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_POSITIVE = 'isPositive';

/**
 * Checks if the value is a positive number greater than zero.
 */
export function isPositive(value: unknown): boolean {
  return typeof value === 'number' && value > 0;
}

/**
 * Checks if the value is a positive number greater than zero.
 */
export function IsPositive(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_POSITIVE,
      validator: {
        validate: (value, args): boolean => isPositive(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a positive number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
