import {ValidationTypes} from "../validation/ValidationTypes";
import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {getFromContainer} from "../container";
import {MetadataStorage} from "../metadata/MetadataStorage";

// -------------------------------------------------------------------------
// System
/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateNested(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NESTED_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * If object has both allowed and not allowed properties a validation error will be thrown.
 */
export function Allow(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.WHITELIST,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export function ValidateIf(condition: (object: any, value: any) => boolean, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [condition],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if given value is defined (!== undefined, !== null).
 */
export function IsDefined(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_DEFINED,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export function IsOptional(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [(object: any, value: any) => {
                return object[propertyName] !== null && object[propertyName] !== undefined;
            }],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

// -------------------------------------------------------------------------
// String-as-types checkers
// -------------------------------------------------------------------------

/**
 * Checks if a string is a boolean.
 */
export function IsBooleanString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_BOOLEAN_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a number.
 */
export function IsNumberString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_NUMBER_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

// -------------------------------------------------------------------------
// String checkers
// -------------------------------------------------------------------------

/**
 * Checks if the string contains the seed.
 */
export function Contains(seed: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [seed],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string does not contain the seed.
 */
export function NotContains(seed: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NOT_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [seed],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains only letters (a-zA-Z).
 */
export function IsAlpha(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ALPHA,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains only letters and numbers.
 */
export function IsAlphanumeric(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ALPHANUMERIC,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains ASCII chars only.
 */
export function IsAscii(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ASCII,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a string is base64 encoded.
 */
export function IsBase64(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_BASE64,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string's length (in bytes) falls in a range.
 */
export function IsByteLength(min: number, max?: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_BYTE_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a credit card.
 */
export function IsCreditCard(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_CREDIT_CARD,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a valid currency amount.
 */
export function IsCurrency(options?: ValidatorJS.IsCurrencyOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_CURRENCY,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is an email.
 */
export function IsEmail(options?: ValidatorJS.IsEmailOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_EMAIL,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 */
export function IsFQDN(options?: ValidatorJS.IsFQDNOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_FQDN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains any full-width chars.
 */
export function IsFullWidth(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_FULL_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains any half-width chars.
 */
export function IsHalfWidth(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_HALF_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains a mixture of full and half-width chars.
 */
export function IsVariableWidth(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_VARIABLE_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a hexadecimal color.
 */
export function IsHexColor(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_HEX_COLOR,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a hexadecimal number.
 */
export function IsHexadecimal(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_HEXADECIMAL,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is an IP (version 4 or 6).
 */
export function IsIP(version?: "4" | "6", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_IP,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is an ISBN (version 10 or 13).
 */
export function IsISBN(version?: "10" | "13", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ISBN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is an ISIN (stock/security identifier).
 */
export function IsISIN(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ISIN,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a valid ISO 8601 date.
 */
export function IsISO8601(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ISO8601,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is valid JSON (note: uses JSON.parse).
 */
export function IsJSON(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_JSON,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is lowercase.
 */
export function IsLowercase(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_LOWERCASE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
 * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
 */
export function IsMobilePhone(locale: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_MOBILE_PHONE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [locale],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 */
export function IsMongoId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_MONGO_ID,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains one or more multibyte chars.
 */
export function IsMultibyte(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_MULTIBYTE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string contains any surrogate pairs chars.
 */
export function IsSurrogatePair(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_SURROGATE_PAIR,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is an url.
 */
export function IsUrl(options?: ValidatorJS.IsURLOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_URL,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 */
export function IsUUID(version?: "3" | "4" | "5", validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_UUID,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string is uppercase.
 */
export function IsUppercase(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_UPPERCASE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 */
export function Length(min: number, max?: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
 */
export function MinLength(min: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MIN_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
 */
export function MaxLength(max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MAX_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
 */
export function Matches(pattern: RegExp, validationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiers?: string, validationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiersOrAnnotationOptions?: string | ValidationOptions, validationOptions?: ValidationOptions): Function {
    let modifiers: string;
    if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !validationOptions) {
        validationOptions = modifiersOrAnnotationOptions as ValidationOptions;
    } else {
        modifiers = modifiersOrAnnotationOptions as string;
    }

    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MATCHES,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [pattern, modifiers],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the string correctly represents a time in the format HH:MM
 */
export function IsMilitaryTime(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_MILITARY_TIME,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

// -------------------------------------------------------------------------
// Array checkers
// -------------------------------------------------------------------------

/**
 * Checks if array contains all values from the given array of values.
 */
export function ArrayContains(values: any[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if array does not contain any of the given values.
 */
export function ArrayNotContains(values: any[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_NOT_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if given array is not empty.
 */
export function ArrayNotEmpty(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_NOT_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if array's length is as minimal this number.
 */
export function ArrayMinSize(min: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_MIN_SIZE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if array's length is as maximal this number.
 */
export function ArrayMaxSize(max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_MAX_SIZE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
export function ArrayUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.ARRAY_UNIQUE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
export function IsInstance(targetType: new (...args: any[]) => any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_INSTANCE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [targetType],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
