import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import emojiRegex from 'emoji-regex';

export const IS_EMOJI = 'isEmoji';

/**
 * Checks if the string is an emoji.
 * If the given value is not a string, then it returns false.
 */
export function isEmoji(value: unknown): boolean {
  const valueMatchesRegex = emojiRegex().test(value as string);

  return typeof value === 'string' && valueMatchesRegex;
}

/**
 * Checks if the string is an emoji.
 * If the given value is not a string, then it returns false.
 */
export function IsEmoji(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_EMOJI,
      validator: {
        validate: (value, args): boolean => isEmoji(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an emoji', validationOptions),
      },
    },
    validationOptions
  );
}
