import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const ARRAY_INCLUDES = 'arrayIncludes';

/**
 * Checks if all values from the given array of values include array's values.
 * If null or undefined is given then this function returns false.
 */
export function arrayIncludes(array: unknown, values: any[]): boolean {
  if (!(array instanceof Array)) return false;

  return array.every(value => values.includes(value));
}

/**
 * Checks if all values from the given array of values include array's values.
 * If null or undefined is given then this function returns false.
 */
export function ArrayIncludes(values: any[], validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_INCLUDES,
      constraints: [values],
      validator: {
        validate: (value, args): boolean => arrayIncludes(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must include some of $constraint1 values',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
