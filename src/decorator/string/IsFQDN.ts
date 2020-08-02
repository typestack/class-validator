import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isFqdnValidator from 'validator/es/lib/isFQDN';
import ValidatorJS from 'validator';

export const IS_FQDN = 'isFqdn';

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export function isFQDN(value: unknown, options?: ValidatorJS.IsFQDNOptions): boolean {
  return typeof value === 'string' && isFqdnValidator(value, options);
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 * If given value is not a string, then it returns false.
 */
export function IsFQDN(options?: ValidatorJS.IsFQDNOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_FQDN,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isFQDN(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid domain name',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
