import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const NOT_EQUALS = 'notEquals';

/**
 * Checks if value does not match ("!==") the comparison.
 */
export function notEquals(value: unknown, comparison: unknown): boolean {
  return value !== comparison;
}

/**
 * Checks if value does not match ("!==") the comparison.
 */
export function NotEquals(comparison: any, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: NOT_EQUALS,
      constraints: [comparison],
      validator: {
        validate: (value, args): boolean => notEquals(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property should not be equal to $constraint1',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
