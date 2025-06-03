import { buildMessage, ValidateBy } from '../decorators';
import { ValidationOptions } from '../ValidationOptions';

export const IS_DURATION = 'isDuration';

const BaseDurationUnits = [
  'Years',
  'Year',
  'Yrs',
  'Yr',
  'Y',
  'Weeks',
  'Week',
  'W',
  'Days',
  'Day',
  'D',
  'Hours',
  'Hour',
  'Hrs',
  'Hr',
  'H',
  'Minutes',
  'Minute',
  'Mins',
  'Min',
  'M',
  'Seconds',
  'Second',
  'Secs',
  'Sec',
  's',
  'Milliseconds',
  'Millisecond',
  'Msecs',
  'Msec',
  'Ms',
] as const;

const AllDurationUnits = new Set(BaseDurationUnits.flatMap(unit => [unit, unit.toUpperCase(), unit.toLowerCase()]));

/**
 * Checks if the string is a valid duration.
 * It is designed to match the format used by the [ms](https://github.com/vercel/ms) package.
 * The duration can be "1 week","2 days","1h", "30m", "15 s", etc.
 */
export function isDuration(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  // using the same number regex used in the `ms` package
  const match = value.match(/^(?<nbr>-?(?:\d+)?\.?\d+)(?:\s?(?<unit>[a-zA-Z]+))?$/);

  if (!match || !match.groups) {
    return false;
  }

  const { unit } = match.groups as { nbr: string; unit?: string };

  return unit === undefined || AllDurationUnits.has(unit);
}

/**
 * Checks if the string is a valid duration.
 * It is designed to match the format used by the [ms](https://github.com/vercel/ms) package.
 * The duration can be "1 week","2 days","1h", "30m", "15 s", etc.
 */
export function IsDuration(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_DURATION,
      validator: {
        validate: (value, args): boolean => isDuration(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid duration string.',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
