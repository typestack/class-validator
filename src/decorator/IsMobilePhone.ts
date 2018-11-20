import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsMobilePhone = require("validator/lib/isMobilePhone");

export const IS_MOBILE_PHONE = "isMobilePhone";

/**
 * Checks if the string is a mobile phone number. See ValidatorJS for a list of supported locales!
 * If given value is not a string, then it returns false.
 */
export function isMobilePhone(value: string, locale: ValidatorJS.MobilePhoneLocale | ValidatorJS.MobilePhoneLocale[] | "any"): boolean {
    // typings are wrong: current ValidatorJS.isMobilePhone supports both one locale and an array of locales!
    return typeof value === "string" && validatorJsIsMobilePhone(value, locale as any);
}

/**
 * Checks if the string is a mobile phone number. See ValidatorJS for a list of supported locales!
 */
export function IsMobilePhone(locale: ValidatorJS.MobilePhoneLocale | ValidatorJS.MobilePhoneLocale[] | any, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_MOBILE_PHONE,
            validate: (value, args) => isMobilePhone(value, args.constraints[0]),
            constraints: [locale],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a phone number", validationOptions)
        },
        validationOptions
    );
}

