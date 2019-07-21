import {ValidationTypes} from "../validation/ValidationTypes";
import {IsNumberOptions} from "../validation/ValidationTypeOptions";
import {ValidationOptions} from "./ValidationOptions";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {ValidationMetadataArgs} from "../metadata/ValidationMetadataArgs";
import {ConstraintMetadata} from "../metadata/ConstraintMetadata";
import {getFromContainer} from "../container";
import {MetadataStorage} from "../metadata/MetadataStorage";

// -------------------------------------------------------------------------
// System
// -------------------------------------------------------------------------

/**
 * Registers custom validator class.
 */
export function ValidatorConstraint(options?: { name?: string, async?: boolean }) {
    return function(target: Function) {
        const isAsync = options && options.async ? true : false;
        let name = options && options.name ? options.name : "";
        if (!name) {
            name = (target as any).name;
            if (!name) // generate name if it was not given
                name = name.replace(/\.?([A-Z]+)/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, "");
        }
        const metadata = new ConstraintMetadata(target, name, isAsync);
        getFromContainer(MetadataStorage).addConstraintMetadata(metadata);
    };
}

/**
 * Performs validation based on the given custom validation class.
 * Validation class must be decorated with ValidatorConstraint decorator.
 */
export function Validate(constraintClass: Function, validationOptions?: ValidationOptions): Function;
export function Validate(constraintClass: Function, constraints?: any[], validationOptions?: ValidationOptions): Function;
export function Validate(constraintClass: Function, constraintsOrValidationOptions?: any[]|ValidationOptions, maybeValidationOptions?: ValidationOptions): Function {
    return function(object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.CUSTOM_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraintCls: constraintClass,
            constraints: constraintsOrValidationOptions instanceof Array ? constraintsOrValidationOptions as any[] : undefined,
            validationOptions: !(constraintsOrValidationOptions instanceof Array) ? constraintsOrValidationOptions as ValidationOptions : maybeValidationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

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

// -------------------------------------------------------------------------
// Common checkers
// -------------------------------------------------------------------------

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
 * Checks if the value match ("===") the comparison.
 */
export function Equals(comparison: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.EQUALS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [comparison],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the value does not match ("!==") the comparison.
 */
export function NotEquals(comparison: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.NOT_EQUALS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [comparison],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
export function IsEmpty(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export function IsNotEmpty(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_NOT_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if value is in a array of allowed values.
 */
export function IsIn(values: any[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_IN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if value is not in a array of disallowed values.
 */
export function IsNotIn(values: any[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_NOT_IN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
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
// Type checkers
// -------------------------------------------------------------------------

/**
 * Checks if a value is a boolean.
 */
export function IsBoolean(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_BOOLEAN,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a value is a date.
 */
export function IsDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_DATE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a value is a number.
 */
export function IsNumber(options: IsNumberOptions = {}, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_NUMBER,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the value is an integer number.
 */
export function IsInt(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_INT,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a value is a string.
 */
export function IsString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

export function IsDateString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_DATE_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a value is an array.
 */
export function IsArray(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ARRAY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if a value is a number enum.
 */
export function IsEnum(entity: Object, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ENUM,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [entity],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}


// -------------------------------------------------------------------------
// Number checkers
// -------------------------------------------------------------------------

/**
 * Checks if the value is a number that's divisible by another.
 */
export function IsDivisibleBy(num: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_DIVISIBLE_BY,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [num],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the value is a positive number.
 */
export function IsPositive(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_POSITIVE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the value is a negative number.
 */
export function IsNegative(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_NEGATIVE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}
/**
 * Checks if the given number is greater than or equal to given number.
 */
export function Min(min: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MIN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the given number is less than or equal to given number.
 */
export function Max(max: number, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MAX,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

// -------------------------------------------------------------------------
// Date checkers
// -------------------------------------------------------------------------

/**
 * Checks if the value is a date that's after the specified date.
 */
export function MinDate(date: Date, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MIN_DATE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [date],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Checks if the value is a date that's before the specified date.
 */
export function MaxDate(date: Date, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.MAX_DATE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [date],
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
 * Checks if the given number is a valid decimal.
 */
export function IsDecimal(options?: ValidatorJS.IsDecimalOptions, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_DECIMAL,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
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
export function IsIP(version?: "4"|"6", validationOptions?: ValidationOptions) {
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
export function IsISBN(version?: "10"|"13", validationOptions?: ValidationOptions) {
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
 * Checks if the string is a valid phone number.
 * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
 */
export function IsPhoneNumber(region: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_PHONE_NUMBER,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [region],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Check if the string is a valid ISO 3166-1 alpha-2.
 * See heck if [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned country code.
 */
export function IsISO31661Alpha2(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ISO31661_ALPHA_2,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            validationOptions: validationOptions
        };
        getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(args));
    };
}

/**
 * Check if the string is a valid ISO 3166-1 alpha-3.
 * See heck if [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) officially assigned country code.
 */
export function IsISO31661Alpha3(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const args: ValidationMetadataArgs = {
            type: ValidationTypes.IS_ISO31661_ALPHA_3,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
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
export function IsUUID(version?: "3"|"4"|"5", validationOptions?: ValidationOptions) {
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
export function Matches(pattern: RegExp, modifiersOrAnnotationOptions?: string|ValidationOptions, validationOptions?: ValidationOptions): Function {
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
