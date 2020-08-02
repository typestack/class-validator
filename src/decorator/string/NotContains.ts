import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import containsValidator from 'validator/es/lib/contains';

export const NOT_CONTAINS = 'notContains';

/**
 * Checks if the string does not contain the seed.
 * If given value is not a string, then it returns false.
 */
export function notContains(value: unknown, seed: string): boolean {
  return typeof value === 'string' && !containsValidator(value, seed);
}

/**
 * Checks if the string does not contain the seed.
 * If given value is not a string, then it returns false.
 */
export function NotContains(seed: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: NOT_CONTAINS,
      constraints: [seed],
      validator: {
        validate: (value, args): boolean => notContains(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property should not contain a $constraint1 string',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
