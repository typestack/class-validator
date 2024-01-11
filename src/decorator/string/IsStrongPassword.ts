import * as validator from 'validator';
import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_STRONG_PASSWORD = 'isStrongPassword';

/**
 * Options to be passed to IsStrongPassword decorator.
 */
export type IsStrongPasswordOptions = Pick<
  validator.StrongPasswordOptions,
  'minLength' | 'minLowercase' | 'minUppercase' | 'minNumbers' | 'minSymbols'
>;

/**
 * Checks if the string is a strong password.
 * If given value is not a string, then it returns false.
 */
export function isStrongPassword(value: unknown, options?: IsStrongPasswordOptions): boolean {
  return typeof value === 'string' && validator.isStrongPassword(value, options);
}

/**
 * Checks if the string is a strong password.
 * If given value is not a string, then it returns false.
 */
export function IsStrongPassword(
  options?: IsStrongPasswordOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_STRONG_PASSWORD,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isStrongPassword(value, args.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is not strong enough', validationOptions),
      },
    },
    validationOptions
  );
}
