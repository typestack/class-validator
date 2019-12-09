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
    private _isEmptyObject;
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
    isDefined(value: unknown): boolean;
    /**
     * Checks if value matches ("===") the comparison.
     */
    equals(value: unknown, comparison: unknown): boolean;
    /**
     * Checks if value does not match ("!==") the comparison.
     */
    notEquals(value: unknown, comparison: unknown): boolean;
    /**
     * Checks if given value is empty (=== '', === null, === undefined).
     */
    isEmpty(value: unknown): boolean;
    /**
     * Checks if given value is not empty (!== '', !== null, !== undefined).
     */
    isNotEmpty(value: unknown): boolean;
    /**
     * Checks if given value is in a array of allowed values.
     */
    isIn(value: unknown, possibleValues: unknown[]): boolean;
    /**
     * Checks if given value not in a array of allowed values.
     */
    isNotIn(value: unknown, possibleValues: unknown[]): boolean;
    /**
     * Checks if a given value is a real boolean.
     */
    isBoolean(value: unknown): boolean;
    /**
    * Checks if a given value is a latitude.
    */
    isLatLong(value: unknown): boolean;
    /**
    * Checks if a given value is a latitude.
    */
    isLatitude(value: unknown): boolean;
    /**
    * Checks if a given value is a longitude.
    */
    isLongitude(value: unknown): boolean;
    /**
     * Checks if a given value is a real date.
     */
    isDate(value: unknown): boolean;
    /**
     * Checks if a given value is a real string.
     */
    isString(value: unknown): value is string;
    /**
     * Checks if a given value is a ISOString date.
     */
    isDateString(value: unknown): boolean;
    /**
     * Checks if a given value is an array
     */
    isArray(value: unknown): boolean;
    /**
     * Checks if a given value is an enum
     */
    isEnum(value: unknown, entity: any): boolean;
    /**
     * Checks if a given value is a number.
     */
    isNumber(value: unknown, options?: IsNumberOptions): boolean;
    /**
     * Checks if value is an integer.
     */
    isInt(val: unknown): boolean;
    /**
     * Checks if value is a number that's divisible by another.
     */
    isDivisibleBy(value: unknown, num: number): boolean;
    /**
     * Checks if the value is a positive number.
     */
    isPositive(value: unknown): boolean;
    /**
     * Checks if the value is a negative number.
     */
    isNegative(value: unknown): boolean;
    /**
     * Checks if the first number is greater than or equal to the second.
     */
    min(num: unknown, min: number): boolean;
    /**
     * Checks if the first number is less than or equal to the second.
     */
    max(num: unknown, max: number): boolean;
    /**
     * Checks if the value is a date that's after the specified date.
     */
    minDate(date: unknown, minDate: Date): boolean;
    /**
     * Checks if the value is a date that's before the specified date.
     */
    maxDate(date: unknown, maxDate: Date): boolean;
    /**
     * Checks if a string is a boolean.
     * If given value is not a string, then it returns false.
     */
    isBooleanString(value: unknown): boolean;
    /**
     * Checks if the string is numeric.
     * If given value is not a string, then it returns false.
     */
    isNumberString(value: unknown, options?: ValidatorJS.IsNumericOptions): boolean;
    /**
     * Checks if the string contains the seed.
     * If given value is not a string, then it returns false.
     */
    contains(value: unknown, seed: string): boolean;
    /**
     * Checks if the string does not contain the seed.
     * If given value is not a string, then it returns false.
     */
    notContains(value: unknown, seed: string): boolean;
    /**
     * Checks if the string contains only letters (a-zA-Z).
     * If given value is not a string, then it returns false.
     */
    isAlpha(value: unknown, locale?: ValidatorJS.AlphaLocale): boolean;
    /**
     * Checks if the string contains only letters and numbers.
     * If given value is not a string, then it returns false.
     */
    isAlphanumeric(value: unknown, locale?: ValidatorJS.AlphanumericLocale): boolean;
    /**
     * Checks if the string is a valid decimal.
     * If given value is not a string, then it returns false.
     */
    isDecimal(value: unknown, options?: ValidatorJS.IsDecimalOptions): boolean;
    /**
     * Checks if the string contains ASCII chars only.
     * If given value is not a string, then it returns false.
     */
    isAscii(value: unknown): boolean;
    /**
     * Checks if a string is base64 encoded.
     * If given value is not a string, then it returns false.
     */
    isBase64(value: unknown): boolean;
    /**
     * Checks if the string's length (in bytes) falls in a range.
     * If given value is not a string, then it returns false.
     */
    isByteLength(value: unknown, min: number, max?: number): boolean;
    /**
     * Checks if the string is a credit card.
     * If given value is not a string, then it returns false.
     */
    isCreditCard(value: unknown): boolean;
    /**
     * Checks if the string is a valid currency amount.
     * If given value is not a string, then it returns false.
     */
    isCurrency(value: unknown, options?: ValidatorJS.IsCurrencyOptions): boolean;
    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    isEmail(value: unknown, options?: ValidatorJS.IsEmailOptions): boolean;
    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     * If given value is not a string, then it returns false.
     */
    isFQDN(value: unknown, options?: ValidatorJS.IsFQDNOptions): boolean;
    /**
     * Checks if the string contains any full-width chars.
     * If given value is not a string, then it returns false.
     */
    isFullWidth(value: unknown): boolean;
    /**
     * Checks if the string contains any half-width chars.
     * If given value is not a string, then it returns false.
     */
    isHalfWidth(value: unknown): boolean;
    /**
     * Checks if the string contains variable-width chars.
     * If given value is not a string, then it returns false.
     */
    isVariableWidth(value: unknown): boolean;
    /**
     * Checks if the string is a hexadecimal color.
     * If given value is not a string, then it returns false.
     */
    isHexColor(value: unknown): boolean;
    /**
     * Checks if the string is a hexadecimal number.
     * If given value is not a string, then it returns false.
     */
    isHexadecimal(value: unknown): boolean;
    /**
     * Check if the string is a MAC address.
     * If given value is not a string, then it returns false.
     */
    isMACAddress(value: unknown): boolean;
    /**
     * Checks if the string is an IP (version 4 or 6).
     * If given value is not a string, then it returns false.
     */
    isIP(value: unknown, version?: number): boolean;
    /**
     * Check if the string is a valid port number.
     */
    isPort(value: unknown): boolean;
    /**
     * Checks if the string is an ISBN (version 10 or 13).
     * If given value is not a string, then it returns false.
     */
    isISBN(value: unknown, version?: number): boolean;
    /**
     * Checks if the string is an ISIN (stock/security identifier).
     * If given value is not a string, then it returns false.
     */
    isISIN(value: unknown): boolean;
    /**
     * Checks if the string is a valid ISO 8601 date.
     * If given value is not a string, then it returns false.
     * Use the option strict = true for additional checks for a valid date, e.g. invalidates dates like 2019-02-29.
     */
    isISO8601(value: unknown, options?: ValidatorJS.IsISO8601Options): boolean;
    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     * If given value is not a string, then it returns false.
     */
    isJSON(value: unknown): boolean;
    /**
     * Checks if the string is valid JWT token.
     * If given value is not a string, then it returns false.
     */
    isJWT(value: unknown): boolean;
    /**
     * Checks if the value is valid Object.
     * Returns false if the value is not an object.
     */
    isObject(value: unknown): value is object;
    /**
     * Checks if the value is valid Object & not empty.
     * Returns false if the value is not an object or an empty valid object.
     */
    isNotEmptyObject(value: unknown): boolean;
    /**
     * Checks if the string is lowercase.
     * If given value is not a string, then it returns false.
     */
    isLowercase(value: unknown): boolean;
    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     * If given value is not a string, then it returns false.
     */
    isMobilePhone(value: unknown, locale: ValidatorJS.MobilePhoneLocale): boolean;
    /**
     * Check if the string is a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned country code.
     */
    isISO31661Alpha2(value: unknown): boolean;
    /**
     * Check if the string is a valid [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) officially assigned country code.
     */
    isISO31661Alpha3(value: unknown): boolean;
    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     * If given value is not a string, then it returns false.
     */
    isMongoId(value: unknown): boolean;
    /**
     * Checks if the string contains one or more multibyte chars.
     * If given value is not a string, then it returns false.
     */
    isMultibyte(value: unknown): boolean;
    /**
     * Checks if the string contains any surrogate pairs chars.
     * If given value is not a string, then it returns false.
     */
    isSurrogatePair(value: unknown): boolean;
    /**
     * Checks if the string is an url.
     * If given value is not a string, then it returns false.
     */
    isURL(value: unknown, options?: ValidatorJS.IsURLOptions): boolean;
    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     * If given value is not a string, then it returns false.
     */
    isUUID(value: unknown, version?: "3" | "4" | "5" | "all"): boolean;
    /**
     * Checks if the string is uppercase.
     * If given value is not a string, then it returns false.
     */
    isUppercase(value: unknown): boolean;
    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    length(value: unknown, min: number, max?: number): boolean;
    /**
     * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    minLength(value: unknown, min: number): boolean;
    /**
     * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    maxLength(value: unknown, max: number): boolean;
    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     * If given value is not a string, then it returns false.
     */
    matches(value: unknown, pattern: RegExp, modifiers?: string): boolean;
    /**
     * Checks if the string represents a time without a given timezone in the format HH:MM (military)
     * If the given value does not match the pattern HH:MM, then it returns false.
     */
    isMilitaryTime(value: unknown): boolean;
    /**
     * check if the string is a hash of type algorithm.
     * Algorithm is one of ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
     * 'tiger160', 'tiger192', 'crc32', 'crc32b']
     */
    isHash(value: unknown, algorithm: ValidatorJS.HashAlgorithm): boolean;
    /**
     * Checks if the string is a ISSN.
     * If given value is not a string, then it returns false.
     */
    isISSN(value: unknown, options?: ValidatorJS.IsISSNOptions): boolean;
    /**
     * Checks if array contains all values from the given array of values.
     * If null or undefined is given then this function returns false.
     */
    arrayContains(array: unknown, values: any[]): boolean;
    /**
     * Checks if array does not contain any of the given values.
     * If null or undefined is given then this function returns false.
     */
    arrayNotContains(array: unknown, values: any[]): boolean;
    /**
     * Checks if given array is not empty.
     * If null or undefined is given then this function returns false.
     */
    arrayNotEmpty(array: unknown): boolean;
    /**
     * Checks if array's length is as minimal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMinSize(array: unknown, min: number): boolean;
    /**
     * Checks if array's length is as maximal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMaxSize(array: unknown, max: number): boolean;
    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     * If null or undefined is given then this function returns false.
     */
    arrayUnique(array: unknown): boolean;
    /**
     * Checks if the value is an instance of the specified object.
     */
    isInstance(object: unknown, targetTypeConstructor: new (...args: any[]) => any): boolean;
}
