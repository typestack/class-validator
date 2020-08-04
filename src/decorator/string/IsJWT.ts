import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isJwtValidator from 'validator/lib/isJWT';

export const IS_JWT = 'isJwt';

/**
 * Checks if the string is valid JWT token.
 * If given value is not a string, then it returns false.
 */
export function isJWT(value: unknown): boolean {
  return typeof value === 'string' && isJwtValidator(value);
}

/**
 * Checks if the string is valid JWT token.
 * If given value is not a string, then it returns false.
 */
export function IsJWT(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_JWT,
      validator: {
        validate: (value, args): boolean => isJWT(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a jwt string', validationOptions),
      },
    },
    validationOptions
  );
}
