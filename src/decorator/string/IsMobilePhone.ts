import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import ValidatorJS from "validator";

export const IS_MOBILE_PHONE = "isMobilePhone";

/**
 * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
 * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
 * If given value is not a string, then it returns false.
 */
export function isMobilePhone(value: unknown, locale: ValidatorJS.MobilePhoneLocale): boolean {
    return typeof value === "string" && ValidatorJS.isMobilePhone(value, locale);
}

/**
 * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
 * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
 * If given value is not a string, then it returns false.
 */
export function IsMobilePhone(locale?: ValidatorJS.MobilePhoneLocale, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_MOBILE_PHONE,
            constraints: [locale],
            validator: {
                validate: (value, args) => isMobilePhone(value, args.constraints[0]),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a phone number",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
