import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isUuidValidator from 'validator/lib/isUUID';

export type UUIDVersion = '3' | '4' | '5' | 'all' | 3 | 4 | 5;

export const IS_UUID = 'isUuid';

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 * If given value is not a string, then it returns false.
 */
export function isUUID(value: unknown, version?: UUIDVersion): boolean {
  return typeof value === 'string' && isUuidValidator(value, version);
}

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 * If given value is not a string, then it returns false.
 */
export function IsUUID(version?: UUIDVersion, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_UUID,
      constraints: [version],
      validator: {
        validate: (value, args): boolean => isUUID(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a UUID', validationOptions),
      },
    },
    validationOptions
  );
}
