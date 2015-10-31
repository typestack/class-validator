import * as bodyParser from 'body-parser';
import {Express} from "express";
import {defaultMetadataStorage} from "../metadata/MetadataStorage";
import {ValidationTypes} from "../types/ValidationTypes";

export interface ValidationAnnotationOptions {
    each?: boolean;
    message?: string;
    groups?: string[];
    always?: boolean;
}

/**
 * Check if the string contains the seed.
 */
export function Contains(seed: string, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.CONTAINS,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: seed,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string matches the comparison.
 */
export function Equals(comparison: string, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.EQUALS,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: comparison,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a date that's after the specified date (defaults to now).
 */
export function IsAfter(date: Date, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_AFTER,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: date,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains only letters (a-zA-Z).
 */
export function IsAlpha(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ALPHA,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains only letters and numbers.
 */
export function IsAlphanumeric(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ALPHANUMERIC,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains ASCII chars only.
 */
export function IsAscii(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ASCII,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains ASCII chars only.
 */
export function IsBase64(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_BASE64,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a date that's before the specified date.
 */
export function IsBefore(date: Date, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_BEFORE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: date,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if a string is a boolean.
 */
export function IsBoolean(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_BOOLEAN,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string's length (in bytes) falls in a range.
 */
export function IsByteLength(min: number, max?: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_BYTE_LENGTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            value2: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a credit card.
 */
export function IsCreditCard(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_CREDIT_CARD,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsCurrencyOptions {
    symbol: string;
    require_symbol: boolean;
    allow_space_after_symbol: boolean;
    symbol_after_digits: boolean;
    allow_negatives: boolean;
    parens_for_negatives: boolean;
    negative_sign_before_digits: boolean;
    negative_sign_after_digits: boolean;
    allow_negative_sign_placeholder: boolean;
    thousands_separator: string;
    decimal_separator: string;
    allow_space_after_digits: boolean
}

/**
 * Check if the string is a valid currency amount.
 */
export function IsCurrency(options?: IsCurrencyOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_CURRENCY,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a date.
 */
export function IsDate(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_DATE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
 */
export function IsDecimal(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_DECIMAL,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a number that's divisible by another.
 */
export function IsDivisibleBy(number: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_DIVISIBLE_BY,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: number,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsEmailOptions {
    allow_display_name: boolean;
    allow_utf8_local_part: boolean;
    require_tld: boolean;
}

/**
 * Check if the string is an email.
 */
export function IsEmail(options?: IsEmailOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_EMAIL,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsFQDNOptions {
    require_tld: boolean;
    allow_underscores: boolean;
    allow_trailing_dot: boolean;
}

/**
 * Check if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsFQDN(options?: IsFQDNOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_FQDN,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsFloatOptions {
    min: number;
    max: number;
}

/**
 * Check if the string is a float.
 */
export function IsFloat(options?: IsFloatOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_FLOAT,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains any full-width chars.
 */
export function IsFullWidth(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_FULL_WIDTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains any half-width chars.
 */
export function IsHalfWidth(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_HALF_WIDTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains any half-width chars.
 */
export function IsHexColor(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_HEX_COLOR,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a hexadecimal number.
 */
export function IsHexadecimal(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_HEXADECIMAL,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is an IP (version 4 or 6).
 */
export function IsIP(version?: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_IP,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: version,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is an ISBN (version 10 or 13).
 */
export function IsISBN(version?: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ISBN,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: version,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is an ISIN (stock/security identifier).
 */
export function IsISIN(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ISIN,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a valid ISO 8601 date.
 */
export function IsISO8601(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_ISO8601,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is in a array of allowed values.
 */
export function IsIn(values: any[], annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_IN,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: values,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsIntOptions {
    min: number;
    max: number;
}

/**
 * Check if the string is an integer.
 */
export function IsInt(options?: IsIntOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_INT,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is valid JSON (note: uses JSON.parse).
 */
export function IsJSON(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_JSON,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 */
export function IsLength(min: number, max?: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_LENGTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            value2: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is lowercase.
 */
export function IsLowercase(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_LOWERCASE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is lowercase.
 */
export function IsMobilePhone(locale: string, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_MOBILE_PHONE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: locale,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 */
export function IsMongoId(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_MONGO_ID,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains one or more multibyte chars.
 */
export function IsMultibyte(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_MULTIBYTE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is null.
 */
export function IsNull(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_NULL,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is numeric.
 */
export function IsNumeric(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_NUMERIC,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains any surrogate pairs chars.
 */
export function IsSurrogatePair(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_SURROGATE_PAIR,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

export interface IsURLOptions {
    protocols: string[];
    require_tld: boolean;
    require_protocol: boolean;
    require_valid_protocol: boolean;
    allow_underscores: boolean;
    host_whitelist: boolean;
    host_blacklist: boolean;
    allow_trailing_dot: boolean;
    allow_protocol_relative_urls: boolean;
}

/**
 * Check if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsUrl(options?: IsURLOptions, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_URL,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: options,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is a UUID (version 3, 4 or 5).
 */
export function IsUUID(version?: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_UUID,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: version,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string is null.
 */
export function IsUppercase(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_UPPERCASE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string contains a mixture of full and half-width chars.
 */
export function IsVariableWidth(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_VARIABLE_WIDTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
 */
export function Matches(pattern: RegExp, annotationOptions?: ValidationAnnotationOptions): Function;
export function Matches(pattern: RegExp, modifiers?: string, annotationOptions?: ValidationAnnotationOptions): Function;
export function Matches(pattern: RegExp, modifiersOrAnnotationOptions?: string|ValidationAnnotationOptions, annotationOptions?: ValidationAnnotationOptions): Function {
    let modifiers: string;
    if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !annotationOptions) {
        annotationOptions = <ValidationAnnotationOptions> modifiersOrAnnotationOptions;
    } else {
        modifiers = <string> modifiersOrAnnotationOptions;
    }

    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MATCHES,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: pattern,
            value2: modifiers,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string's length is not less then given number. Note: this function takes into account surrogate pairs.
 */
export function MinLength(min: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MIN_LENGTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the string's length is not more then given number. Note: this function takes into account surrogate pairs.
 */
export function MaxLength(max: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MAX_LENGTH,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the given number is not less then given number.
 */
export function MinNumber(min: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MIN_NUMBER,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Check if the given number is not more then given number.
 */
export function MaxNumber(max: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MAX_NUMBER,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Checks if given value is not empty
 */
export function NotEmpty(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.NOT_EMPTY,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Checks if given array is not empty.
 */
export function NotEmptyArray(annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.NOT_EMPTY_ARRAY,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Checks if array's length is as minimal this number.
 */
export function MinElements(min: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MIN_ELEMENTS,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}

/**
 * Checks if array's length is as maximal this number.
 */
export function MaxElements(max: number, annotationOptions?: ValidationAnnotationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MAX_ELEMENTS,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    }
}