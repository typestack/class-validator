import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_EMOJI = 'isEmoji';
const emojiPattern = /^\p{Emoji}$/u;
/**
 * Checks if the string is an emoji.
 * If given value is not a emoji, then it returns false.
 */
export function isEmoji(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (!isNaN(Number(value))) return false;
  if (value.startsWith('U+') && value.length === 7)
    return emojiPattern.test(String.fromCodePoint(parseInt('0x' + value.substring(2), 16)));
  return emojiPattern.test(value);
}

/**
 * Checks if the string is an emoji.
 * If given value is not a emoji, then it returns false.
 */
export function IsEmoji(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_EMOJI,
      validator: {
        validate: (value): boolean => isEmoji(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an emoji', validationOptions),
      },
    },
    validationOptions
  );
}
