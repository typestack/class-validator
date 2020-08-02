import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isDecimalValidator from 'validator/es/lib/isDecimal';
import ValidatorJS from 'validator';

export const IS_DECIMAL = 'isDecimal';

/**
 * Checks if the string is a valid decimal.
 * If given value is not a string, then it returns false.
 */
export function isDecimal(value: unknown, options?: ValidatorJS.IsDecimalOptions): boolean {
  return typeof value === 'string' && isDecimalValidator(value, options);
}

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function IsDecimal(
  options?: ValidatorJS.IsDecimalOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_DECIMAL,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isDecimal(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property is not a valid decimal number.',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
