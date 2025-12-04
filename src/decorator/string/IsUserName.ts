import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_USER_NAME = 'isUserName';

/**
 * Options for IsUserName validator
 */
export interface IsUserNameOptions {
  /**
   * Additional characters allowed in the username (besides unicode letters, unicode numbers, spaces, hyphens, and apostrophes)
   * @default ''
   */
  allowedCharacters?: string;
}

/**
 * Checks if the string is a valid username.
 * By default, allows unicode letters (\p{L}), unicode numbers (\p{N}), spaces, hyphens (-), and apostrophes (').
 * Additional characters can be specified via options.
 * If given value is not a string, then it returns false.
 */
export function isUserName(value: unknown, options?: IsUserNameOptions): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  // Default allowed characters: unicode letters (\p{L}), unicode numbers (\p{N}), spaces, hyphens, apostrophes
  // Using unicode property escapes for better internationalization support
  const defaultAllowed = "\\p{L}\\p{N}\\s\\-'";
  
  // Escape special regex characters from user-provided allowed characters
  const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Build the regex pattern
  const allowedChars = options?.allowedCharacters 
    ? defaultAllowed + escapeRegex(options.allowedCharacters)
    : defaultAllowed;

  // Create regex pattern: start to end, only allowed characters
  // Using 'u' flag for unicode support
  const pattern = new RegExp(`^[${allowedChars}]+$`, 'u');

  return pattern.test(value);
}

/**
 * Checks if the string is a valid username.
 * By default, allows unicode letters (\p{L}), unicode numbers (\p{N}), spaces, hyphens (-), and apostrophes (').
 * Additional characters can be specified via options.
 * If given value is not a string, then it returns false.
 */
export function IsUserName(
  options?: IsUserNameOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_USER_NAME,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isUserName(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          (eachPrefix, args) => {
            const options = args?.constraints[0] as IsUserNameOptions | undefined;
            const allowedChars = options?.allowedCharacters 
              ? `, and ${options.allowedCharacters.split('').join(', ')}`
              : '';
            return eachPrefix + '$property must contain only letters, numbers, spaces, hyphens (-), apostrophes (\')' + allowedChars;
          },
          validationOptions
        ),
      },
    },
    validationOptions
  );
}

