import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_TIMEZONE = 'isTimezone';

/**
 * Checks if the string represents a valid IANA timezone
 * If the given value is not a valid IANA timezone, then it returns false.
 */
export function isTimezone(value: unknown): boolean {
  try {
    if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone || typeof value !== 'string') {
      return false;
    }

    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch (exception) {
    return false;
  }
}

/**
 * Checks if the string represents a valid IANA timezone
 * If the given value is not a valid IANA timezone, then it returns false.
 */
export function IsTimezone(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_TIMEZONE,
      validator: {
        validate: (value, args): boolean => isTimezone(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid IANA timezone',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
