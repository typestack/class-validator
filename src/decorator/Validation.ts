import {defaultMetadataStorage} from "../metadata/MetadataStorage";
import {ValidationTypes} from "../types/ValidationTypes";
import {IsEmailOptions, IsFQDNOptions, IsFloatOptions, IsURLOptions, IsIntOptions, IsCurrencyOptions} from "../ValidationOptions";

/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {

    /**
     * Specifies if validated value is an array and each of its item must be validated.
     */
    each?: boolean;

    /**
     * Message used to be shown on validation fail.
     */
    message?: string;

    /**
     * Validation groups used for this validation.
     */
    groups?: string[];

    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always?: boolean;
}

/**
 * Decorator used to register custom validators.
 */
export function ValidatorConstraint() {
    return function(object: Function) {
        defaultMetadataStorage.addConstraintMetadata({
            sanitize: false,
            object: object
        });
    };
}

/**
 * Performs validation based on the given custom validation class.
 */
export function Validate(constraintClass: Function, annotationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.CUSTOM_VALIDATION,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: constraintClass,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Checks if the string contains the seed.
 */
export function Contains(seed: string, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string matches the comparison.
 */
export function Equals(comparison: string, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a date that's after the specified date.
 */
export function IsAfter(date: Date, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains only letters (a-zA-Z).
 */
export function IsAlpha(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains only letters and numbers.
 */
export function IsAlphanumeric(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains ASCII chars only.
 */
export function IsAscii(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if a string is base64 encoded.
 */
export function IsBase64(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a date that's before the specified date.
 */
export function IsBefore(date: Date, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if a value is a boolean.
 */
export function IsBoolean(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if a string is a boolean.
 */
export function IsBooleanString(annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_BOOLEAN_STRING,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Checks if the string's length (in bytes) falls in a range.
 */
export function IsByteLength(min: number, max?: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a credit card.
 */
export function IsCreditCard(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a valid currency amount.
 */
export function IsCurrency(options?: IsCurrencyOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a date.
 */
export function IsDate(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
 */
export function IsDecimal(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a number that's divisible by another.
 */
export function IsDivisibleBy(num: number, annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.IS_DIVISIBLE_BY,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: num,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Checks if the string is an email.
 */
export function IsEmail(options?: IsEmailOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsFQDN(options?: IsFQDNOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a float.
 */
export function IsFloat(options?: IsFloatOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains any full-width chars.
 */
export function IsFullWidth(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains any half-width chars.
 */
export function IsHalfWidth(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains a mixture of full and half-width chars.
 */
export function IsVariableWidth(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a hexadecimal color.
 */
export function IsHexColor(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a hexadecimal number.
 */
export function IsHexadecimal(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is an IP (version 4 or 6).
 */
export function IsIP(version?: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is an ISBN (version 10 or 13).
 */
export function IsISBN(version?: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is an ISIN (stock/security identifier).
 */
export function IsISIN(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a valid ISO 8601 date.
 */
export function IsISO8601(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is in a array of allowed values.
 */
export function IsIn(values: any[], annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is an integer.
 */
export function IsInt(options?: IsIntOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is valid JSON (note: uses JSON.parse).
 */
export function IsJSON(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 */
export function IsLength(min: number, max?: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is lowercase.
 */
export function IsLowercase(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
 * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
 */
export function IsMobilePhone(locale: string, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 */
export function IsMongoId(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains one or more multibyte chars.
 */
export function IsMultibyte(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is null.
 */
export function IsNull(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is numeric.
 */
export function IsNumeric(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string contains any surrogate pairs chars.
 */
export function IsSurrogatePair(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsUrl(options?: IsURLOptions, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 */
export function IsUUID(version?: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string is uppercase.
 */
export function IsUppercase(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
 */
export function Matches(pattern: RegExp, annotationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiers?: string, annotationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiersOrAnnotationOptions?: string|ValidationOptions, annotationOptions?: ValidationOptions): Function {
    let modifiers: string;
    if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !annotationOptions) {
        annotationOptions = <ValidationOptions> modifiersOrAnnotationOptions;
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
    };
}

/**
 * Checks if the string's length is not less then given number. Note: this function takes into account surrogate pairs.
 */
export function MinLength(min: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the string's length is not more then given number. Note: this function takes into account surrogate pairs.
 */
export function MaxLength(max: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the given number is not less then given number.
 */
export function MinNumber(min: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if the given number is not more then given number.
 */
export function MaxNumber(max: number, annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if given value is not empty.
 */
export function NotEmpty(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if given array is not empty.
 */
export function NotEmptyArray(annotationOptions?: ValidationOptions) {
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
    };
}

/**
 * Checks if array's length is as minimal this number.
 */
export function MinSize(min: number, annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MIN_SIZE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: min,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Checks if array's length is as maximal this number.
 */
export function MaxSize(max: number, annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.MAX_SIZE,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            value1: max,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}

/**
 * Checks if array's length is as maximal this number.
 */
export function ValidateNested(annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.NESTED_VALIDATION,
            sanitize: false,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}