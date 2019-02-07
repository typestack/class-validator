/// <reference types="validator" />
import { ValidationMetadata } from "../metadata/ValidationMetadata";
import { ValidationError } from "./ValidationError";
import { IsNumberOptions } from "./ValidationTypeOptions";
import { ValidatorOptions } from "./ValidatorOptions";
/**
 * Validator performs validation of the given object based on its metadata.
 */
export declare class Validator {
    private validatorJs;
    private libPhoneNumber;
    /**
     * Performs validation of the given object based on decorators or validation schema.
     * Common method for `validateOrReject` and `validate` methods.
     */
    private coreValidate;
    /**
     * Performs validation of the given object based on decorators used in given object class.
     */
    validate(object: Object, options?: ValidatorOptions): Promise<ValidationError[]>;
    /**
     * Performs validation of the given object based on validation schema.
     */
    validate(schemaName: string, object: Object, options?: ValidatorOptions): Promise<ValidationError[]>;
    /**
     * Performs validation of the given object based on decorators used in given object class and reject on error.
     */
    validateOrReject(object: Object, options?: ValidatorOptions): Promise<void>;
    /**
     * Performs validation of the given object based on validation schema and reject on error.
     */
    validateOrReject(schemaName: string, object: Object, options?: ValidatorOptions): Promise<void>;
    /**
     * Performs validation of the given object based on decorators used in given object class.
     * NOTE: This method completely ignores all async validations.
     */
    validateSync(object: Object, options?: ValidatorOptions): ValidationError[];
    /**
     * Performs validation of the given object based on validation schema.
     */
    validateSync(schemaName: string, object: Object, options?: ValidatorOptions): ValidationError[];
    /**
     * Performs validation of the given object based on the given ValidationMetadata object.
     */
    validateValueByMetadata(value: any, metadata: ValidationMetadata): boolean;
    /**
     * Checks if value is defined (!== undefined, !== null).
     */
    isDefined(value: any): boolean;
    /**
     * Checks if value matches ("===") the comparison.
     */
    equals(value: any, comparison: any): boolean;
    /**
     * Checks if value does not match ("!==") the comparison.
     */
    notEquals(value: any, comparison: any): boolean;
    /**
     * Checks if given value is empty (=== '', === null, === undefined).
     */
    isEmpty(value: any): boolean;
    /**
     * Checks if given value is not empty (!== '', !== null, !== undefined).
     */
    isNotEmpty(value: any): boolean;
    /**
     * Checks if given value is in a array of allowed values.
     */
    isIn(value: any, possibleValues: any[]): boolean;
    /**
     * Checks if given value not in a array of allowed values.
     */
    isNotIn(value: any, possibleValues: any[]): boolean;
    /**
     * Checks if a given value is a real boolean.
     */
    isBoolean(value: any): boolean;
    /**
     * Checks if a given value is a real date.
     */
    isDate(value: any): boolean;
    /**
     * Checks if a given value is a real string.
     */
    isString(value: any): boolean;
    /**
     * Checks if a given value is a ISOString date.
     */
    isDateString(value: any): boolean;
    /**
     * Checks if a given value is an array
     */
    isArray(value: any): boolean;
    /**
     * Checks if a given value is an enum
     */
    isEnum(value: any, entity: any): boolean;
    /**
     * Checks if a given value is a number.
     */
    isNumber(value: any, options?: IsNumberOptions): boolean;
    /**
     * Checks if value is an integer.
     */
    isInt(val: number): boolean;
    /**
     * Checks if value is a number that's divisible by another.
     */
    isDivisibleBy(value: number, num: number): boolean;
    /**
     * Checks if the value is a positive number.
     */
    isPositive(value: number): boolean;
    /**
     * Checks if the value is a negative number.
     */
    isNegative(value: number): boolean;
    /**
     * Checks if the first number is greater than or equal to the second.
     */
    min(num: number, min: number): boolean;
    /**
     * Checks if the first number is less than or equal to the second.
     */
    max(num: number, max: number): boolean;
    /**
     * Checks if the value is a date that's after the specified date.
     */
    minDate(date: Date, minDate: Date): boolean;
    /**
     * Checks if the value is a date that's before the specified date.
     */
    maxDate(date: Date, maxDate: Date): boolean;
    /**
     * Checks if a string is a boolean.
     * If given value is not a string, then it returns false.
     */
    isBooleanString(value: string): boolean;
    /**
     * Checks if the string is numeric.
     * If given value is not a string, then it returns false.
     */
    isNumberString(value: string, options?: ValidatorJS.IsNumericOptions): boolean;
    /**
     * Checks if the string contains the seed.
     * If given value is not a string, then it returns false.
     */
    contains(value: string, seed: string): boolean;
    /**
     * Checks if the string does not contain the seed.
     * If given value is not a string, then it returns false.
     */
    notContains(value: string, seed: string): boolean;
    /**
     * Checks if the string contains only letters (a-zA-Z).
     * If given value is not a string, then it returns false.
     */
    isAlpha(value: string): boolean;
    /**
     * Checks if the string contains only letters and numbers.
     * If given value is not a string, then it returns false.
     */
    isAlphanumeric(value: string): boolean;
    /**
     * Checks if the string contains ASCII chars only.
     * If given value is not a string, then it returns false.
     */
    isAscii(value: string): boolean;
    /**
     * Checks if a string is base64 encoded.
     * If given value is not a string, then it returns false.
     */
    isBase64(value: string): boolean;
    /**
     * Checks if the string's length (in bytes) falls in a range.
     * If given value is not a string, then it returns false.
     */
    isByteLength(value: string, min: number, max?: number): boolean;
    /**
     * Checks if the string is a credit card.
     * If given value is not a string, then it returns false.
     */
    isCreditCard(value: string): boolean;
    /**
     * Checks if the string is a valid currency amount.
     * If given value is not a string, then it returns false.
     */
    isCurrency(value: string, options?: ValidatorJS.IsCurrencyOptions): boolean;
    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    isEmail(value: string, options?: ValidatorJS.IsEmailOptions): boolean;
    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     * If given value is not a string, then it returns false.
     */
    isFQDN(value: string, options?: ValidatorJS.IsFQDNOptions): boolean;
    /**
     * Checks if the string contains any full-width chars.
     * If given value is not a string, then it returns false.
     */
    isFullWidth(value: string): boolean;
    /**
     * Checks if the string contains any half-width chars.
     * If given value is not a string, then it returns false.
     */
    isHalfWidth(value: string): boolean;
    /**
     * Checks if the string contains variable-width chars.
     * If given value is not a string, then it returns false.
     */
    isVariableWidth(value: string): boolean;
    /**
     * Checks if the string is a hexadecimal color.
     * If given value is not a string, then it returns false.
     */
    isHexColor(value: string): boolean;
    /**
     * Checks if the string is a hexadecimal number.
     * If given value is not a string, then it returns false.
     */
    isHexadecimal(value: string): boolean;
    /**
     * Checks if the string is an IP (version 4 or 6).
     * If given value is not a string, then it returns false.
     */
    isIP(value: string, version?: "4" | "6"): boolean;
    /**
     * Checks if the string is an ISBN (version 10 or 13).
     * If given value is not a string, then it returns false.
     */
    isISBN(value: string, version?: "10" | "13"): boolean;
    /**
     * Checks if the string is an ISIN (stock/security identifier).
     * If given value is not a string, then it returns false.
     */
    isISIN(value: string): boolean;
    /**
     * Checks if the string is a valid ISO 8601 date.
     * If given value is not a string, then it returns false.
     */
    isISO8601(value: string): boolean;
    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     * If given value is not a string, then it returns false.
     */
    isJSON(value: string): boolean;
    /**
     * Checks if the string is lowercase.
     * If given value is not a string, then it returns false.
     */
    isLowercase(value: string): boolean;
    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     * If given value is not a string, then it returns false.
     */
    isMobilePhone(value: string, locale: ValidatorJS.MobilePhoneLocale): boolean;
    /**
     * Checks if the string is a valid phone number.
     * @param value the potential phone number string to test
     * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
     * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
     * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
     */
    isPhoneNumber(value: string, region: string): boolean;
    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     * If given value is not a string, then it returns false.
     */
    isMongoId(value: string): boolean;
    /**
     * Checks if the string contains one or more multibyte chars.
     * If given value is not a string, then it returns false.
     */
    isMultibyte(value: string): boolean;
    /**
     * Checks if the string contains any surrogate pairs chars.
     * If given value is not a string, then it returns false.
     */
    isSurrogatePair(value: string): boolean;
    /**
     * Checks if the string is an url.
     * If given value is not a string, then it returns false.
     */
    isURL(value: string, options?: ValidatorJS.IsURLOptions): boolean;
    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     * If given value is not a string, then it returns false.
     */
    isUUID(value: string, version?: "3" | "4" | "5"): boolean;
    /**
     * Checks if the string is uppercase.
     * If given value is not a string, then it returns false.
     */
    isUppercase(value: string): boolean;
    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    length(value: string, min: number, max?: number): boolean;
    /**
     * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    minLength(value: string, min: number): boolean;
    /**
     * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    maxLength(value: string, max: number): boolean;
    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     * If given value is not a string, then it returns false.
     */
    matches(value: string, pattern: RegExp, modifiers?: string): boolean;
    /**
     * Checks if the string represents a time without a given timezone in the format HH:MM (military)
     * If the given value does not match the pattern HH:MM, then it returns false.
     */
    isMilitaryTime(value: string): boolean;
    /**
     * Checks if array contains all values from the given array of values.
     * If null or undefined is given then this function returns false.
     */
    arrayContains(array: any[], values: any[]): boolean;
    /**
     * Checks if array does not contain any of the given values.
     * If null or undefined is given then this function returns false.
     */
    arrayNotContains(array: any[], values: any[]): boolean;
    /**
     * Checks if given array is not empty.
     * If null or undefined is given then this function returns false.
     */
    arrayNotEmpty(array: any[]): boolean;
    /**
     * Checks if array's length is as minimal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMinSize(array: any[], min: number): boolean;
    /**
     * Checks if array's length is as maximal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMaxSize(array: any[], max: number): boolean;
    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     * If null or undefined is given then this function returns false.
     */
    arrayUnique(array: any[]): boolean;
    /**
     * Checks if the value is an instance of the specified object.
     */
    isInstance(object: any, targetTypeConstructor: new (...args: any[]) => any): boolean;
}
//# sourceMappingURL=Validator.d.ts.map