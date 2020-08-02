import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isEthereumAddressValidator from 'validator/es/lib/isEthereumAddress';

export const IS_ETHEREUM_ADDRESS = 'isEthereumAddress';

/**
 * Check if the string is an Ethereum address using basic regex. Does not validate address checksums.
 * If given value is not a string, then it returns false.
 */
export function isEthereumAddress(value: unknown): boolean {
  return typeof value === 'string' && isEthereumAddressValidator(value);
}

/**
 * Check if the string is an Ethereum address using basic regex. Does not validate address checksums.
 * If given value is not a string, then it returns false.
 */
export function IsEthereumAddress(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ETHEREUM_ADDRESS,
      validator: {
        validate: (value, args): boolean => isEthereumAddress(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be an Ethereum address',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
