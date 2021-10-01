import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const ARRAY_CONTAINS_ANY_OF = 'arrayContainsAnyOf';

/**
 * Checks if all array values are contained in the given set.
 * If null or undefined is given then this function returns false.
 */
export function arrayContainsAnyOf(array: unknown, values: any[]): boolean {
  if (!(array instanceof Array)) return false;

  return array.every(value => values.indexOf(value) !== -1);
}

/**
 * Checks if all array values are contained in the given set.
 * If null or undefined is given then this function returns false.
 */
export function ArrayContainsAnyOf(values: any[], validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'arrayContainsAny',
      constraints: [values],
      validator: {
        validate: (value, args): boolean => arrayContainsAnyOf(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property values must be on of $constraint1',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
