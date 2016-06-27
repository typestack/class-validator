import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {ValidationTypes} from "./ValidationTypes";
import {ValidationError} from "./ValidationError";
import {
    IsEmailOptions,
    IsFQDNOptions,
    IsURLOptions,
    IsCurrencyOptions
} from "./ValidationTypeOptions";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationExecutor} from "./ValidationExecutor";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private validatorJs = require("validator");

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs validation of the given object based on annotations used in given object class.
     */
    validate(object: any, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
        return new ValidationExecutor(this, validatorOptions).execute(object);
    }

    /**
     * Performs validation of the given object based on the given ValidationMetadata object.
     */
    validateBasedOnMetadata(value: any, metadata: ValidationMetadata): boolean {
        switch (metadata.type) {
            /* common checkers */
            case ValidationTypes.IS_EQUAL:
                return this.equals(value, metadata.value1);
            case ValidationTypes.IS_NOT_EQUAL:
                return this.notEquals(value, metadata.value1);
            case ValidationTypes.IS_EMPTY:
                return this.empty(value);
            case ValidationTypes.IS_NOT_EMPTY:
                return this.notEmpty(value);
            case ValidationTypes.IS_IN:
                return this.isIn(value, metadata.value1);
            case ValidationTypes.IS_NOT_IN:
                return this.isNotIn(value, metadata.value1);

            /* type checkers */
            case ValidationTypes.IS_BOOLEAN:
                return this.isBoolean(value);
            case ValidationTypes.IS_DATE:
                return this.isDate(value);
            case ValidationTypes.IS_NUMBER:
                return this.isNumber(value);
            case ValidationTypes.IS_STRING:
                return this.isString(value);

            /* number checkers */
            case ValidationTypes.IS_DIVISIBLE_BY:
                return this.isDivisibleBy(value, metadata.value1);
            case ValidationTypes.IS_DECIMAL:
                return this.isDecimal(value);
            case ValidationTypes.IS_INT:
                return this.isInt(value);
            case ValidationTypes.IS_POSITIVE:
                return this.isPositive(value);
            case ValidationTypes.IS_NEGATIVE:
                return this.isNegative(value);
            case ValidationTypes.IS_GREATER:
                return this.isGreater(value, metadata.value1);
            case ValidationTypes.IS_LESS:
                return this.isLess(value, metadata.value1);

            /* date checkers */
            case ValidationTypes.IS_MIN_DATE:
                return this.isMinDate(value, metadata.value1);
            case ValidationTypes.IS_MAX_DATE:
                return this.isMaxDate(value, metadata.value1);

            /* regexp checkers */
            case ValidationTypes.IS_MATCH:
                return this.matches(value, metadata.value1, metadata.value2);

            /* string-as-type checkers */
            case ValidationTypes.IS_BOOLEAN_STRING:
                return this.isBooleanString(value);
            case ValidationTypes.IS_DATE_STRING:
                return this.isDateString(value);
            case ValidationTypes.IS_NUMBER_STRING:
                return this.isNumberString(value);

            /* string checkers */
            case ValidationTypes.IS_CONTAIN:
                return this.contains(value, metadata.value1);
            case ValidationTypes.IS_NOT_CONTAIN:
                return this.notContains(value, metadata.value1);
            case ValidationTypes.IS_ALPHA:
                return this.isAlpha(value);
            case ValidationTypes.IS_ALPHANUMERIC:
                return this.isAlphanumeric(value);
            case ValidationTypes.IS_ASCII:
                return this.isAscii(value);
            case ValidationTypes.IS_BASE64:
                return this.isBase64(value);
            case ValidationTypes.IS_BYTE_LENGTH:
                return this.isByteLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_CREDIT_CARD:
                return this.isCreditCard(value);
            case ValidationTypes.IS_CURRENCY:
                return this.isCurrency(value, metadata.value1);
            case ValidationTypes.IS_EMAIL:
                return this.isEmail(value, metadata.value1);
            case ValidationTypes.IS_FQDN:
                return this.isFQDN(value, metadata.value1);
            case ValidationTypes.IS_FULL_WIDTH:
                return this.isFullWidth(value);
            case ValidationTypes.IS_HALF_WIDTH:
                return this.isHalfWidth(value);
            case ValidationTypes.IS_VARIABLE_WIDTH:
                return this.isVariableWidth(value);
            case ValidationTypes.IS_HEX_COLOR:
                return this.isHexColor(value);
            case ValidationTypes.IS_HEXADECIMAL:
                return this.isHexadecimal(value);
            case ValidationTypes.IS_IP:
                return this.isIP(value, metadata.value1);
            case ValidationTypes.IS_ISBN:
                return this.isISBN(value, metadata.value1);
            case ValidationTypes.IS_ISIN:
                return this.isISIN(value);
            case ValidationTypes.IS_ISO8601:
                return this.isISO8601(value);
            case ValidationTypes.IS_JSON:
                return this.isJSON(value);
            case ValidationTypes.IS_LENGTH:
                return this.isLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_LOWERCASE:
                return this.isLowercase(value);
            case ValidationTypes.IS_MOBILE_PHONE:
                return this.isMobilePhone(value, metadata.value1);
            case ValidationTypes.IS_MONGO_ID:
                return this.isMongoId(value);
            case ValidationTypes.IS_MULTIBYTE:
                return this.isMultibyte(value);
            case ValidationTypes.IS_SURROGATE_PAIR:
                return this.isSurrogatePair(value);
            case ValidationTypes.IS_URL:
                return this.isURL(value, metadata.value1);
            case ValidationTypes.IS_UUID:
                return this.isUUID(value, metadata.value1);
            case ValidationTypes.IS_UPPERCASE:
                return this.isUppercase(value);
            case ValidationTypes.MIN_LENGTH:
                return this.isLength(value, metadata.value1);
            case ValidationTypes.MAX_LENGTH:
                return this.isLength(value, 0, metadata.value1);

            /* array checkers */
            case ValidationTypes.IS_CONTAIN_IN_ARRAY:
                return this.containInArray(value, metadata.value1);
            case ValidationTypes.IS_NOT_CONTAIN_IN_ARRAY:
                return this.notContainInArray(value, metadata.value1);
            case ValidationTypes.IS_NOT_EMPTY_ARRAY:
                return this.isNotEmptyArray(value);
            case ValidationTypes.IS_MIN_SIZE:
                return this.isMinSize(value, metadata.value1);
            case ValidationTypes.IS_MAX_SIZE:
                return this.isMaxSize(value, metadata.value1);
            case ValidationTypes.IS_ALL_UNIQUE:
                return this.isAllUnique(value);
        }
        return true;
    }

    // -------------------------------------------------------------------------
    // Validation Methods: common checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if value matches ("===") the comparison.
     */
    equals(value: any, comparison: any): boolean {
        return value === comparison;
    }

    /**
     * Checks if value does not match ("!==") the comparison.
     */
    notEquals(value: any, comparison: any): boolean {
        return value !== comparison;
    }

    /**
     * Checks if given value is empty (=== '', === null, === undefined).
     */
    empty(value: any): boolean {
        return value === "" || value === null || value === undefined;
    }

    /**
     * Checks if given value is not empty (!== '', !== null, !== undefined).
     */
    notEmpty(value: any): boolean {
        return value !== "" && value !== null && value !== undefined;
    }

    /**
     * Checks if given value is in a array of allowed values.
     */
    isIn(value: any, possibleValues: any[]): boolean {
        return possibleValues.some(possibleValue => possibleValue === value);
    }

    /**
     * Checks if given value not in a array of allowed values.
     */
    isNotIn(value: any, possibleValues: any[]): boolean {
        return !possibleValues.some(possibleValue => possibleValue === value);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: type checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if a given value is a real boolean.
     */
    isBoolean(value: any): boolean {
        return value instanceof Boolean || typeof value === "boolean";
    }

    /**
     * Checks if a given value is a real date.
     */
    isDate(value: any): boolean {
        return value instanceof Date;
    }

    /**
     * Checks if a given value is a real number.
     */
    isNumber(value: any): boolean {
        return value instanceof Number || typeof value === "number";
    }

    /**
     * Checks if a given value is a real string.
     */
    isString(value: any): boolean {
        return value instanceof String || typeof value === "string";
    }

    // -------------------------------------------------------------------------
    // Validation Methods: number checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if value is a number that's divisible by another.
     */
    isDivisibleBy(value: number, num: number): boolean {
        const numberString = String(value); // fix it
        return this.validatorJs.isDivisibleBy(numberString, num);
    }

    /**
     * Checks if value represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
     */
    isDecimal(value: number): boolean {
        const numberString = String(value); // fix it
        return this.validatorJs.isDecimal(numberString);
    }

    /**
     * Checks if value is an integer.
     */
    isInt(val: number): boolean {
        const numberString = String(val); // fix it
        return this.validatorJs.isInt(numberString);
    }

    /**
     * Checks if the value is a positive integer.
     */
    isPositive(value: number): boolean {
        return value > 0;
    }

    /**
     * Checks if the value is a negative integer.
     */
    isNegative(value: number): boolean {
        return value < 0;
    }

    /**
     * Checks if the first number is greater then second.
     */
    isGreater(first: number, second: number): boolean {
        return first > second;
    }

    /**
     * Checks if the first number is less then second.
     */
    isLess(first: number, second: number): boolean {
        return first > second;
    }

    // -------------------------------------------------------------------------
    // Validation Methods: date checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if the value is a date that's after the specified date.
     */
    isMinDate(date: Date, minDate: Date): boolean {
        return date.getTime() <= minDate.getTime();
    }

    /**
     * Checks if the value is a date that's before the specified date.
     */
    isMaxDate(date: Date, maxDate: Date): boolean {
        return date.getTime() >= maxDate.getTime();
    }

    // -------------------------------------------------------------------------
    // Validation Methods: regexp checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     */
    matches(str: string, pattern: RegExp, modifiers?: string): boolean {
        return this.validatorJs.matches(str, pattern, modifiers);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: string-as-type checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if a string is a boolean.
     */
    isBooleanString(str: any): boolean {
        return this.validatorJs.isBoolean(str);
    }

    /**
     * Checks if the string is a date.
     */
    isDateString(str: string): boolean {
        return this.validatorJs.isDate(str);
    }

    /**
     * Checks if the string is numeric.
     */
    isNumberString(str: string): boolean {
        return this.validatorJs.isNumeric(str);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: string checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if the string contains the seed.
     */
    contains(str: string, seed: string): boolean {
        return this.validatorJs.contains(str, seed);
    }

    /**
     * Checks if the string does not contain the seed.
     */
    notContains(str: string, seed: string): boolean {
        return !this.validatorJs.contains(str, seed);
    }

    /**
     * Checks if the string contains only letters (a-zA-Z).
     */
    isAlpha(str: string): boolean {
        return this.validatorJs.isAlpha(str);
    }

    /**
     * Checks if the string contains only letters and numbers.
     */
    isAlphanumeric(str: string): boolean {
        return this.validatorJs.isAlphanumeric(str);
    }

    /**
     * Checks if the string contains ASCII chars only.
     */
    isAscii(str: string): boolean {
        return this.validatorJs.isAscii(str);
    }

    /**
     * Checks if a string is base64 encoded.
     */
    isBase64(str: string): boolean {
        return this.validatorJs.isBase64(str);
    }

    /**
     * Checks if the string's length (in bytes) falls in a range.
     */
    isByteLength(str: string, min: number, max?: number): boolean {
        return this.validatorJs.isByteLength(str, min, max);
    }

    /**
     * Checks if the string is a credit card.
     */
    isCreditCard(str: string): boolean {
        return this.validatorJs.isCreditCard(str);
    }

    /**
     * Checks if the string is a valid currency amount.
     */
    isCurrency(str: string, options?: IsCurrencyOptions): boolean {
        return this.validatorJs.isCurrency(str, options);
    }

    /**
     * Checks if the string is an email.
     */
    isEmail(str: string, options?: IsEmailOptions): boolean {
        return this.validatorJs.isEmail(str, options);
    }

    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     */
    isFQDN(str: string, options?: IsFQDNOptions): boolean {
        return this.validatorJs.isFQDN(str, options);
    }

    /**
     * Checks if the string contains any full-width chars.
     */
    isFullWidth(str: string): boolean {
        return this.validatorJs.isFullWidth(str);
    }

    /**
     * Checks if the string contains any half-width chars.
     */
    isHalfWidth(str: string): boolean {
        return this.validatorJs.isHalfWidth(str);
    }

    /**
     * Checks if the string contains variable-width chars.
     */
    isVariableWidth(str: string): boolean {
        return this.validatorJs.isVariableWidth(str);
    }

    /**
     * Checks if the string is a hexadecimal color.
     */
    isHexColor(str: string): boolean {
        return this.validatorJs.isHexColor(str);
    }

    /**
     * Checks if the string is a hexadecimal number.
     */
    isHexadecimal(str: string): boolean {
        return this.validatorJs.isHexadecimal(str);
    }

    /**
     * Checks if the string is an IP (version 4 or 6).
     */
    isIP(str: string, version?: number): boolean {
        return this.validatorJs.isIP(str, version);
    }

    /**
     * Checks if the string is an ISBN (version 10 or 13).
     */
    isISBN(str: string, version?: number): boolean {
        return this.validatorJs.isISBN(str, version);
    }

    /**
     * Checks if the string is an ISIN (stock/security identifier).
     */
    isISIN(str: string): boolean {
        return this.validatorJs.isISIN(str);
    }

    /**
     * Checks if the string is a valid ISO 8601 date.
     */
    isISO8601(str: string): boolean {
        return this.validatorJs.isISO8601(str);
    }

    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     */
    isJSON(str: string): boolean {
        return this.validatorJs.isJSON(str);
    }

    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     */
    isLength(str: string, min: number, max?: number): boolean {
        return typeof str === "string" && this.validatorJs.isLength(str, min, max);
    }

    /**
     * Checks if the string is lowercase.
     */
    isLowercase(str: string): boolean {
        return this.validatorJs.isLowercase(str);
    }

    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     */
    isMobilePhone(str: string, locale: string): boolean {
        return this.validatorJs.isMobilePhone(str, locale);
    }

    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     */
    isMongoId(str: string): boolean {
        return this.validatorJs.isMongoId(str);
    }

    /**
     * Checks if the string contains one or more multibyte chars.
     */
    isMultibyte(str: string): boolean {
        return this.validatorJs.isMultibyte(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isSurrogatePair(str: string): boolean {
        return this.validatorJs.isSurrogatePair(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isURL(str: string, options?: IsURLOptions): boolean {
        return this.validatorJs.isURL(str, options);
    }

    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     */
    isUUID(str: string, version?: number): boolean {
        return this.validatorJs.isUUID(str, version);
    }

    /**
     * Checks if the string is uppercase.
     */
    isUppercase(str: string): boolean {
        return this.validatorJs.isUppercase(str);
    }

    /**
     * Checks if the string's length is not less then given number. Note: this function takes into account surrogate pairs.
     */
    isMinLength(str: string, min: number) {
        return this.isLength(str, min);
    }

    /**
     * Checks if the string's length is not more then given number. Note: this function takes into account surrogate pairs.
     */
    isMaxLength(str: string, max: number) {
        return this.isLength(str, 0, max);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: array checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if array contains all values from the given array of values.
     */
    containInArray(array: any[], values: any[]) {
        return values.every(value => array.indexOf(value) !== -1);
    }

    /**
     * Checks if array does not contain any of the given values.
     */
    notContainInArray(array: any[], values: any[]) {
        return values.every(value => array.indexOf(value) === -1);
    }

    /**
     * Checks if given array is not empty.
     */
    isNotEmptyArray(array: any[]) {
        return array.length === 0;
    }

    /**
     * Checks if array's length is as minimal this number.
     */
    isMinSize(array: any[], min: number) {
        return array.length >= min;
    }

    /**
     * Checks if array's length is as maximal this number.
     */
    isMaxSize(array: any[], max: number) {
        return array.length <= max;
    }

    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     */
    isAllUnique(array: any[]) {
        const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
        return array.length === uniqueItems.length;
    }

}
