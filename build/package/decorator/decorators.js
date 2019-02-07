"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationTypes_1 = require("../validation/ValidationTypes");
var ValidationMetadata_1 = require("../metadata/ValidationMetadata");
var ConstraintMetadata_1 = require("../metadata/ConstraintMetadata");
var container_1 = require("../container");
var MetadataStorage_1 = require("../metadata/MetadataStorage");
// -------------------------------------------------------------------------
// System
// -------------------------------------------------------------------------
/**
 * Registers custom validator class.
 */
function ValidatorConstraint(options) {
    return function (target) {
        var isAsync = options && options.async ? true : false;
        var name = options && options.name ? options.name : "";
        if (!name) {
            name = target.name;
            if (!name) // generate name if it was not given
                name = name.replace(/\.?([A-Z]+)/g, function (x, y) { return "_" + y.toLowerCase(); }).replace(/^_/, "");
        }
        var metadata = new ConstraintMetadata_1.ConstraintMetadata(target, name, isAsync);
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addConstraintMetadata(metadata);
    };
}
exports.ValidatorConstraint = ValidatorConstraint;
function Validate(constraintClass, constraintsOrValidationOptions, maybeValidationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.CUSTOM_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraintCls: constraintClass,
            constraints: constraintsOrValidationOptions instanceof Array ? constraintsOrValidationOptions : undefined,
            validationOptions: !(constraintsOrValidationOptions instanceof Array) ? constraintsOrValidationOptions : maybeValidationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Validate = Validate;
/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
function ValidateNested(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.NESTED_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ValidateNested = ValidateNested;
/**
 * If object has both allowed and not allowed properties a validation error will be thrown.
 */
function Allow(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.WHITELIST,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Allow = Allow;
/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
function ValidateIf(condition, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [condition],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ValidateIf = ValidateIf;
// -------------------------------------------------------------------------
// Common checkers
// -------------------------------------------------------------------------
/**
 * Checks if given value is defined (!== undefined, !== null).
 */
function IsDefined(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_DEFINED,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsDefined = IsDefined;
/**
 * Checks if the value match ("===") the comparison.
 */
function Equals(comparison, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.EQUALS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [comparison],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Equals = Equals;
/**
 * Checks if the value does not match ("!==") the comparison.
 */
function NotEquals(comparison, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.NOT_EQUALS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [comparison],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.NotEquals = NotEquals;
/**
 * Checks if given value is empty (=== '', === null, === undefined).
 */
function IsEmpty(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsEmpty = IsEmpty;
/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
function IsNotEmpty(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_NOT_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsNotEmpty = IsNotEmpty;
/**
 * Checks if value is in a array of allowed values.
 */
function IsIn(values, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_IN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsIn = IsIn;
/**
 * Checks if value is not in a array of disallowed values.
 */
function IsNotIn(values, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_NOT_IN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsNotIn = IsNotIn;
/**
 * Checks if value is missing and if so, ignores all validators.
 */
function IsOptional(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.CONDITIONAL_VALIDATION,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [function (object, value) {
                    return object[propertyName] !== null && object[propertyName] !== undefined;
                }],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsOptional = IsOptional;
// -------------------------------------------------------------------------
// Type checkers
// -------------------------------------------------------------------------
/**
 * Checks if a value is a boolean.
 */
function IsBoolean(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_BOOLEAN,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsBoolean = IsBoolean;
/**
 * Checks if a value is a date.
 */
function IsDate(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_DATE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsDate = IsDate;
/**
 * Checks if a value is a number.
 */
function IsNumber(options, validationOptions) {
    if (options === void 0) { options = {}; }
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_NUMBER,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsNumber = IsNumber;
/**
 * Checks if the value is an integer number.
 */
function IsInt(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_INT,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsInt = IsInt;
/**
 * Checks if a value is a string.
 */
function IsString(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsString = IsString;
function IsDateString(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_DATE_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsDateString = IsDateString;
/**
 * Checks if a value is an array.
 */
function IsArray(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ARRAY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsArray = IsArray;
/**
 * Checks if a value is a number enum.
 */
function IsEnum(entity, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ENUM,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [entity],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsEnum = IsEnum;
// -------------------------------------------------------------------------
// Number checkers
// -------------------------------------------------------------------------
/**
 * Checks if the value is a number that's divisible by another.
 */
function IsDivisibleBy(num, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_DIVISIBLE_BY,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [num],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsDivisibleBy = IsDivisibleBy;
/**
 * Checks if the value is a positive number.
 */
function IsPositive(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_POSITIVE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsPositive = IsPositive;
/**
 * Checks if the value is a negative number.
 */
function IsNegative(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_NEGATIVE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsNegative = IsNegative;
/**
 * Checks if the given number is greater than or equal to given number.
 */
function Min(min, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MIN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Min = Min;
/**
 * Checks if the given number is less than or equal to given number.
 */
function Max(max, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MAX,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Max = Max;
// -------------------------------------------------------------------------
// Date checkers
// -------------------------------------------------------------------------
/**
 * Checks if the value is a date that's after the specified date.
 */
function MinDate(date, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MIN_DATE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [date],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.MinDate = MinDate;
/**
 * Checks if the value is a date that's before the specified date.
 */
function MaxDate(date, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MAX_DATE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [date],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.MaxDate = MaxDate;
// -------------------------------------------------------------------------
// String-as-types checkers
// -------------------------------------------------------------------------
/**
 * Checks if a string is a boolean.
 */
function IsBooleanString(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_BOOLEAN_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsBooleanString = IsBooleanString;
/**
 * Checks if the string is a number.
 */
function IsNumberString(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_NUMBER_STRING,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsNumberString = IsNumberString;
// -------------------------------------------------------------------------
// String checkers
// -------------------------------------------------------------------------
/**
 * Checks if the string contains the seed.
 */
function Contains(seed, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [seed],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Contains = Contains;
/**
 * Checks if the string does not contain the seed.
 */
function NotContains(seed, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.NOT_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [seed],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.NotContains = NotContains;
/**
 * Checks if the string contains only letters (a-zA-Z).
 */
function IsAlpha(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ALPHA,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsAlpha = IsAlpha;
/**
 * Checks if the string contains only letters and numbers.
 */
function IsAlphanumeric(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ALPHANUMERIC,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsAlphanumeric = IsAlphanumeric;
/**
 * Checks if the string contains ASCII chars only.
 */
function IsAscii(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ASCII,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsAscii = IsAscii;
/**
 * Checks if a string is base64 encoded.
 */
function IsBase64(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_BASE64,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsBase64 = IsBase64;
/**
 * Checks if the string's length (in bytes) falls in a range.
 */
function IsByteLength(min, max, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_BYTE_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsByteLength = IsByteLength;
/**
 * Checks if the string is a credit card.
 */
function IsCreditCard(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_CREDIT_CARD,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsCreditCard = IsCreditCard;
/**
 * Checks if the string is a valid currency amount.
 */
function IsCurrency(options, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_CURRENCY,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsCurrency = IsCurrency;
/**
 * Checks if the string is an email.
 */
function IsEmail(options, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_EMAIL,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsEmail = IsEmail;
/**
 * Checks if the string is a fully qualified domain name (e.g. domain.com).
 */
function IsFQDN(options, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_FQDN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsFQDN = IsFQDN;
/**
 * Checks if the string contains any full-width chars.
 */
function IsFullWidth(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_FULL_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsFullWidth = IsFullWidth;
/**
 * Checks if the string contains any half-width chars.
 */
function IsHalfWidth(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_HALF_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsHalfWidth = IsHalfWidth;
/**
 * Checks if the string contains a mixture of full and half-width chars.
 */
function IsVariableWidth(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_VARIABLE_WIDTH,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsVariableWidth = IsVariableWidth;
/**
 * Checks if the string is a hexadecimal color.
 */
function IsHexColor(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_HEX_COLOR,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsHexColor = IsHexColor;
/**
 * Checks if the string is a hexadecimal number.
 */
function IsHexadecimal(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_HEXADECIMAL,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsHexadecimal = IsHexadecimal;
/**
 * Checks if the string is an IP (version 4 or 6).
 */
function IsIP(version, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_IP,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsIP = IsIP;
/**
 * Checks if the string is an ISBN (version 10 or 13).
 */
function IsISBN(version, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ISBN,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsISBN = IsISBN;
/**
 * Checks if the string is an ISIN (stock/security identifier).
 */
function IsISIN(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ISIN,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsISIN = IsISIN;
/**
 * Checks if the string is a valid ISO 8601 date.
 */
function IsISO8601(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_ISO8601,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsISO8601 = IsISO8601;
/**
 * Checks if the string is valid JSON (note: uses JSON.parse).
 */
function IsJSON(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_JSON,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsJSON = IsJSON;
/**
 * Checks if the string is lowercase.
 */
function IsLowercase(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_LOWERCASE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsLowercase = IsLowercase;
/**
 * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
 * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
 */
function IsMobilePhone(locale, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_MOBILE_PHONE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [locale],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsMobilePhone = IsMobilePhone;
/**
 * Checks if the string is a valid phone number.
 * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
 */
function IsPhoneNumber(region, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_PHONE_NUMBER,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [region],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsPhoneNumber = IsPhoneNumber;
/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 */
function IsMongoId(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_MONGO_ID,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsMongoId = IsMongoId;
/**
 * Checks if the string contains one or more multibyte chars.
 */
function IsMultibyte(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_MULTIBYTE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsMultibyte = IsMultibyte;
/**
 * Checks if the string contains any surrogate pairs chars.
 */
function IsSurrogatePair(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_SURROGATE_PAIR,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsSurrogatePair = IsSurrogatePair;
/**
 * Checks if the string is an url.
 */
function IsUrl(options, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_URL,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [options],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsUrl = IsUrl;
/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 */
function IsUUID(version, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_UUID,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [version],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsUUID = IsUUID;
/**
 * Checks if the string is uppercase.
 */
function IsUppercase(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_UPPERCASE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsUppercase = IsUppercase;
/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 */
function Length(min, max, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min, max],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Length = Length;
/**
 * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
 */
function MinLength(min, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MIN_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.MinLength = MinLength;
/**
 * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
 */
function MaxLength(max, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MAX_LENGTH,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.MaxLength = MaxLength;
function Matches(pattern, modifiersOrAnnotationOptions, validationOptions) {
    var modifiers;
    if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !validationOptions) {
        validationOptions = modifiersOrAnnotationOptions;
    }
    else {
        modifiers = modifiersOrAnnotationOptions;
    }
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.MATCHES,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [pattern, modifiers],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.Matches = Matches;
/**
 * Checks if the string correctly represents a time in the format HH:MM
 */
function IsMilitaryTime(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_MILITARY_TIME,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsMilitaryTime = IsMilitaryTime;
// -------------------------------------------------------------------------
// Array checkers
// -------------------------------------------------------------------------
/**
 * Checks if array contains all values from the given array of values.
 */
function ArrayContains(values, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayContains = ArrayContains;
/**
 * Checks if array does not contain any of the given values.
 */
function ArrayNotContains(values, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_NOT_CONTAINS,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [values],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayNotContains = ArrayNotContains;
/**
 * Checks if given array is not empty.
 */
function ArrayNotEmpty(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_NOT_EMPTY,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayNotEmpty = ArrayNotEmpty;
/**
 * Checks if array's length is as minimal this number.
 */
function ArrayMinSize(min, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_MIN_SIZE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [min],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayMinSize = ArrayMinSize;
/**
 * Checks if array's length is as maximal this number.
 */
function ArrayMaxSize(max, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_MAX_SIZE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [max],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayMaxSize = ArrayMaxSize;
/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
function ArrayUnique(validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.ARRAY_UNIQUE,
            target: object.constructor,
            propertyName: propertyName,
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.ArrayUnique = ArrayUnique;
/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
function IsInstance(targetType, validationOptions) {
    return function (object, propertyName) {
        var args = {
            type: ValidationTypes_1.ValidationTypes.IS_INSTANCE,
            target: object.constructor,
            propertyName: propertyName,
            constraints: [targetType],
            validationOptions: validationOptions
        };
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(args));
    };
}
exports.IsInstance = IsInstance;

//# sourceMappingURL=decorators.js.map
