import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const MIN_DATE = 'minDate';

/**
 * Checks if the value is a date that's after the specified date.
 */
export function minDate(date: unknown, minDate: Date): boolean {
  return date instanceof Date && date.getTime() >= minDate.getTime();
}

/**
 * Checks if the value is a date that's after the specified date.
 */
export function MinDate(date: Date, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: MIN_DATE,
      constraints: [date],
      validator: {
        validate: (value, args): boolean => minDate(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => 'minimal allowed date for ' + eachPrefix + '$property is $constraint1',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
