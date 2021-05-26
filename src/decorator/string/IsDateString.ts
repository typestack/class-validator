import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import ValidatorJS from 'validator';
import { isISO8601 } from './IsISO8601';

export const IS_DATE_STRING = 'isDateString';

/**
 * Alias for IsISO8601 validator
 */
export function isDateString(value: unknown, options?: ValidatorJS.IsISO8601Options): boolean {
  return isISO8601(value, options);
}

/**
 * Alias for IsISO8601 validator
 */
export function IsDateString(
  options?: ValidatorJS.IsISO8601Options,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_DATE_STRING,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isDateString(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid ISO 8601 date string',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
