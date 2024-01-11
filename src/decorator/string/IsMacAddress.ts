import { ValidationOptions, isValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isMacAddressValidator from 'validator/lib/isMACAddress';
import * as ValidatorJS from 'validator';

export const IS_MAC_ADDRESS = 'isMacAddress';

/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
export function isMACAddress(value: unknown, options?: ValidatorJS.IsMACAddressOptions): boolean {
  return typeof value === 'string' && isMacAddressValidator(value, options);
}

/**
 * Check if the string is a MAC address.
 * If given value is not a string, then it returns false.
 */
export function IsMACAddress(
  optionsArg?: ValidatorJS.IsMACAddressOptions,
  validationOptionsArg?: ValidationOptions
): PropertyDecorator;
export function IsMACAddress(validationOptionsArg?: ValidationOptions): PropertyDecorator;
export function IsMACAddress(
  optionsOrValidationOptionsArg?: ValidatorJS.IsMACAddressOptions | ValidationOptions,
  validationOptionsArg?: ValidationOptions
): PropertyDecorator {
  const options = !isValidationOptions(optionsOrValidationOptionsArg) ? optionsOrValidationOptionsArg : undefined;
  const validationOptions = isValidationOptions(optionsOrValidationOptionsArg)
    ? optionsOrValidationOptionsArg
    : validationOptionsArg;

  return ValidateBy(
    {
      name: IS_MAC_ADDRESS,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isMACAddress(value, options),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a MAC Address', validationOptions),
      },
    },
    validationOptions
  );
}
