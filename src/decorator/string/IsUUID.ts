import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isUuidValidator from 'validator/lib/isUUID';
import * as ValidatorJS from 'validator';

export const IS_UUID = 'isUuid';

export type IsUUIDVersion = ValidatorJS.UUIDVersion | ValidatorJS.UUIDVersion[];

/**
 * Checks if the string is a UUID (version 1-8, nil, max, loose, all).
 * If given value is not a string, then it returns false.
 * Supports single version or array of versions.
 */
export function isUUID(value: unknown, version?: IsUUIDVersion): boolean {
  if (typeof value !== 'string') return false;
  if (Array.isArray(version)) {
    for (const v of version) {
      if (isUuidValidator(value, v)) return true;
    }
    return false;
  }
  return isUuidValidator(value, version);
}

/**
 * Checks if the string is a UUID (version 1-8, nil, max, loose, all).
 * If given value is not a string, then it returns false.
 * Supports single version or array of versions.
 */
export function IsUUID(version?: IsUUIDVersion, validationOptions?: ValidationOptions): PropertyDecorator {
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
