import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isNumericValidator from 'validator/es/lib/isNumeric';
import ValidatorJS from 'validator';

export const IS_NUMBER_STRING = 'isNumberString';

/**
 * Checks if the string is numeric.
 * If given value is not a string, then it returns false.
 */
export function isNumberString(value: unknown, options?: ValidatorJS.IsNumericOptions): boolean {
  return typeof value === 'string' && isNumericValidator(value, options);
}

/**
 * Checks if the string is numeric.
 * If given value is not a string, then it returns false.
 */
export function IsNumberString(
  options?: ValidatorJS.IsNumericOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NUMBER_STRING,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isNumberString(value, args.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a number string', validationOptions),
      },
    },
    validationOptions
  );
}
