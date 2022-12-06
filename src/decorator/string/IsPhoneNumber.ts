import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const IS_PHONE_NUMBER = 'isPhoneNumber';

type Options = { region?: CountryCode; strategy?: 'valid' | 'possible' };

type RegionOrOptions = CountryCode | Options;

function normalizeOptions(regionOrOptions?: RegionOrOptions): Options | undefined {
  return typeof regionOrOptions === 'string' ? { region: regionOrOptions } : regionOrOptions;
}

/**
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param value the potential phone number string to test
 * @param regionOrOptions 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 * Or an object containing a `region` and `strategy` properties:
 * - `region`: 2 characters uppercase country code (see above)
 * - `strategy`: the validation severity level
 */
export function isPhoneNumber(value: string, regionOrOptions?: RegionOrOptions): boolean {
  try {
    const normalizedOptions = normalizeOptions(regionOrOptions);
    const phoneNum = parsePhoneNumberFromString(value, normalizedOptions?.region);
    const result = 'possible' === normalizedOptions?.strategy ? phoneNum?.isPossible() : phoneNum?.isValid();
    return !!result;
  } catch (error) {
    // logging?
    return false;
  }
}

/**
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param region 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 * Or an object containing a `region` and `strategy` properties:
 * - `region`: 2 characters uppercase country code (see above)
 * - `strategy`: the validation severity level
 */
export function IsPhoneNumber(
  regionOrOptions?: RegionOrOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PHONE_NUMBER,
      constraints: [regionOrOptions],
      validator: {
        validate: (value, args): boolean => isPhoneNumber(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid phone number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
