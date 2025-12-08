import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const ARRAY_SIZE = 'arraySize';

/**
 * Checks if the array's length is equal to the specified number.
 * If null or undefined is given then this function returns false.
 */
export function arraySize(array: unknown, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

/**
 * Checks if the array's length is equal to the specified number.
 * If null or undefined is given then this function returns false.
 */
export function ArraySize(size: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_SIZE,
      constraints: [size],
      validator: {
        validate: (value, args): boolean => arraySize(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must contain exactly $constraint1 elements',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
