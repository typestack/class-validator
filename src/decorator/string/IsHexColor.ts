import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isHexColorValidator from 'validator/es/lib/isHexColor';

export const IS_HEX_COLOR = 'isHexColor';

/**
 * Checks if the string is a hexadecimal color.
 * If given value is not a string, then it returns false.
 */
export function isHexColor(value: unknown): boolean {
  return typeof value === 'string' && isHexColorValidator(value);
}

/**
 * Checks if the string is a hexadecimal color.
 * If given value is not a string, then it returns false.
 */
export function IsHexColor(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_HEX_COLOR,
      validator: {
        validate: (value, args): boolean => isHexColor(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a hexadecimal color',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
