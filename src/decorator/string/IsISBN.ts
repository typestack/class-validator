import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isIsbnValidator from 'validator/lib/isISBN';

export type IsISBNVersion = '10' | '13' | 10 | 13;

export const IS_ISBN = 'isIsbn';

/**
 * Checks if the string is an ISBN (version 10 or 13).
 * If given value is not a string, then it returns false.
 */
export function isISBN(value: unknown, version?: IsISBNVersion): boolean {
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */
  const versionStr = version ? (`${version}` as '10' | '13') : undefined;
  return typeof value === 'string' && isIsbnValidator(value, versionStr);
}

/**
 * Checks if the string is an ISBN (version 10 or 13).
 * If given value is not a string, then it returns false.
 */
export function IsISBN(version?: IsISBNVersion, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISBN,
      constraints: [version],
      validator: {
        validate: (value, args): boolean => isISBN(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an ISBN', validationOptions),
      },
    },
    validationOptions
  );
}
