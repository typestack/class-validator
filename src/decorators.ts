import {defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ValidationTypes} from "./ValidationTypes";
import {IsEmailOptions, IsFQDNOptions, IsFloatOptions, IsURLOptions, IsIntOptions, IsCurrencyOptions} from "./ValidatorOptions";

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
 * Indicates if nested object should be validated as well.
 */
export function ValidateNested(annotationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            type: ValidationTypes.NESTED_VALIDATION,
            object: object,
            propertyName: propertyName,
            groups: annotationOptions && annotationOptions.groups ? annotationOptions.groups : undefined,
            message: annotationOptions && annotationOptions.message ? annotationOptions.message : undefined,
            always: annotationOptions && annotationOptions.always ? annotationOptions.always : undefined,
            each: annotationOptions && annotationOptions.each ? annotationOptions.each : undefined
        });
    };
}