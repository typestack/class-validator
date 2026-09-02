import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isLengthValidator from 'validator/lib/isLength';

export const IS_LENGTH = 'isLength';

/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export function length(value: unknown, min: number, max?: number): boolean {
  return typeof value === 'string' && isLengthValidator(value, { min, max });
}

/**
 * Character length used to choose the default Length message.
 * With `{ each: true }`, `args.value` is the whole collection, so collection.size would pick the wrong bound.
 */
function characterLengthForMessage(value: unknown, min: number, max?: number): number | undefined {
  if (typeof value === 'string') {
    return value.length;
  }

  let items: unknown[] | undefined;
  if (Array.isArray(value)) {
    items = value;
  } else if (value instanceof Set) {
    items = Array.from(value);
  } else if (value instanceof Map) {
    items = Array.from(value.values());
  }

  if (items) {
    const failing = items.find(item => typeof item === 'string' && !length(item, min, max));
    return typeof failing === 'string' ? failing.length : undefined;
  }

  return value != null ? (value as { length?: number }).length : undefined;
}

/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export function Length(min: number, max?: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_LENGTH,
      constraints: [min, max],
      validator: {
        validate: (value, args): boolean => length(value, args?.constraints[0], args?.constraints[1]),
        defaultMessage: buildMessage((eachPrefix, args) => {
          const min = args?.constraints[0];
          const max = args?.constraints[1];
          const isMinLength = min !== null && min !== undefined;
          const isMaxLength = max !== null && max !== undefined;
          const charLength = characterLengthForMessage(args?.value, min, max);

          if (isMinLength && (charLength === undefined || charLength < min)) {
            return eachPrefix + '$property must be longer than or equal to $constraint1 characters';
          } else if (isMaxLength && charLength !== undefined && charLength > max) {
            return eachPrefix + '$property must be shorter than or equal to $constraint2 characters';
          }
          return (
            eachPrefix +
            '$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters'
          );
        }, validationOptions),
      },
    },
    validationOptions
  );
}
