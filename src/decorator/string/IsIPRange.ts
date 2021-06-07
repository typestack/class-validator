import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isIPRangeValidator from 'validator/lib/isIPRange';

export type IsIpRangeVersion = '4' | '6' | 4 | 6;

export const IS_IP_RANGE = 'isIpRange';

/**
 * Checks if the string is an IP range (version 4 or 6).
 * If given value is not a string, then it returns false.
 */
export function isIPRange(value: unknown, version?: IsIpRangeVersion): boolean {
  const versionStr = version ? (`${version}` as '4' | '6') : undefined;
  return typeof value === 'string' && isIPRangeValidator(value, versionStr);
}

/**
 * Checks if the string is an IP range (version 4 or 6).
 * If given value is not a string, then it returns false.
 */
export function IsIPRange(version?: IsIpRangeVersion, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_IP_RANGE,
      constraints: [version],
      validator: {
        validate: (value, args): boolean => isIPRange(value, args.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an ip range', validationOptions),
      },
    },
    validationOptions
  );
}
