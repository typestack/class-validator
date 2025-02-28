import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isBase64Validator from 'validator/lib/isBase64';
import * as ValidatorJS from 'validator';

export const IS_BASE64 = 'isBase64';

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function isBase64(value: unknown, options?: ValidatorJS.IsBase64Options): boolean {
  return typeof value === 'string' && isBase64Validator(value, options);
}

/**
 * Checks if a string is base64 encoded.
 * If given value is not a string, then it returns false.
 */
export function IsBase64(
  options?: ValidatorJS.IsBase64Options,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_BASE64,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isBase64(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be base64 encoded', validationOptions),
      },
    },
    validationOptions
  );
}
