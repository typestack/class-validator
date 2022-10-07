import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import matchesValidator from 'validator/lib/matches';

export const MATCHES = 'matches';

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i).
 * If given value is not a string, then it returns false.
 */
export function matches(value: string, pattern: RegExp): boolean;
export function matches(value: string, pattern: string, modifiers: string): boolean;
export function matches(value: string, pattern: RegExp | string, modifiers?: string): boolean {
  return typeof value === 'string' && matchesValidator(value, pattern as unknown as any, modifiers);
}

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i)
 * If given value is not a string, then it returns false.
 */
export function Matches(pattern: RegExp, validationOptions?: ValidationOptions): PropertyDecorator;
export function Matches(pattern: string, modifiers?: string, validationOptions?: ValidationOptions): PropertyDecorator;
export function Matches(
  pattern: RegExp | string,
  modifiersOrAnnotationOptions?: string | ValidationOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  let modifiers: string;
  if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !validationOptions) {
    validationOptions = modifiersOrAnnotationOptions;
  } else {
    modifiers = modifiersOrAnnotationOptions as string;
  }

  return ValidateBy(
    {
      name: MATCHES,
      constraints: [pattern, modifiers],
      validator: {
        validate: (value, args): boolean => matches(value, args?.constraints[0], args?.constraints[1]),
        defaultMessage: buildMessage(
          (eachPrefix, args) => eachPrefix + '$property must match $constraint1 regular expression',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
