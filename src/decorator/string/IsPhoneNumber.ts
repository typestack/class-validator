import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import { PhoneNumberUtil } from "google-libphonenumber";

export const IS_PHONE_NUMBER = "isPhoneNumber";

/**
 * Checks if the string is a valid phone number.
 * @param value the potential phone number string to test
 * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
 */
export function isPhoneNumber(value: string, region: string | null): boolean {
    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
        const phoneNum = phoneUtil.parseAndKeepRawInput(value, region);
        const result = phoneUtil.isValidNumber(phoneNum);
        return result;
    } catch (error) {
        // logging?
        return false;
    }
}

/**
 * Checks if the string is a valid phone number.
 * @param region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
 */
export function IsPhoneNumber(region: string | null, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_PHONE_NUMBER,
            constraints: [region],
            validator: {
                validate: (value, args): boolean => isPhoneNumber(value, args.constraints[0]),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a valid phone number",
                    validationOptions
                ),
            }
        },
        validationOptions
    );
}
