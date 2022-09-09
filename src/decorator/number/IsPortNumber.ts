import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isPortValidator from 'validator/lib/isPort';

export const IS_PORT_NUMBER = 'isPortNumber';

/**
 * Check if the number is a valid port number.
 */
export function isPortNumber(value: unknown): boolean {
  return typeof value === 'number' && isPortValidator(`${value}`);
}

/**
 * Check if the number is a valid port number.
 */
export function IsPortNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PORT_NUMBER,
      validator: {
        validate: (value, args): boolean => isPortNumber(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a port number', validationOptions),
      },
    },
    validationOptions
  );
}
