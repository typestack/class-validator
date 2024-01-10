import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isUrlValidator from 'validator/lib/isURL';
import * as ValidatorJS from 'validator';

export const IS_URL = 'isUrl';

/**
 * Checks if the string is a url.
 * If given value is not a string, then it returns false.
 */
export function isURL(value: string, options?: ValidatorJS.IsURLOptions): boolean {
  return typeof value === 'string' && isUrlValidator(value, options);
}

/**
 * Checks if the string is a url.
 * If given value is not a string, then it returns false.
 */
export function IsUrl(options?: ValidatorJS.IsURLOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_URL,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isURL(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a URL address', validationOptions),
      },
    },
    validationOptions
  );
}
