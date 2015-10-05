import * as bodyParser from 'body-parser';
import {Express} from "express";
import {defaultMetadataStorage} from "../metadata/MetadataStorage";
import {SanitizeTypes} from "../types/SanitizeTypes";

/**
 * Remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to
 * escape some chars, e.g @Blacklist('\\[\\]')
 */
export function Blacklist(chars: RegExp) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.BLACKLIST,
            object: object,
            propertyName: propertyName,
            value1: chars
        });
    }
}

/**
 * Replace <, >, &, ', " and / with HTML entities
 */
export function Escape() {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.ESCAPE,
            object: object,
            propertyName: propertyName
        });
    }
}

/**
 * Trim characters from the left-side of the input.
 */
export function Ltrim(chars?: string[]) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.LTRIM,
            object: object,
            propertyName: propertyName,
            value1: chars
        });
    }
}

/**
 * Canonicalize an email address.
 */
export function NormalizeEmail(lowercase?: boolean) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.NORMALIZE_EMAIL,
            object: object,
            propertyName: propertyName,
            value1: lowercase
        });
    }
}

/**
 * Trim characters from the left-side of the input.
 */
export function Rtrim(chars?: string[]) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.RTRIM,
            object: object,
            propertyName: propertyName,
            value1: chars
        });
    }
}

/**
 * Remove characters with a numerical value < 32 and 127, mostly control characters.
 * If keep_new_lines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
 * Unicode-safe in JavaScript.
 */
export function StripLow(keep_new_lines?: boolean) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.STRIP_LOW,
            object: object,
            propertyName: propertyName,
            value1: keep_new_lines
        });
    }
}

/**
 * Convert the input to a boolean.
 * Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
 */
export function ToBoolean(isStrict?: boolean) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_BOOLEAN,
            object: object,
            propertyName: propertyName,
            value1: isStrict
        });
    }
}

/**
 * Convert the input to a date, or null if the input is not a date.
 */
export function ToDate() {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_DATE,
            object: object,
            propertyName: propertyName
        });
    }
}

/**
 * Convert the input to a date, or null if the input is not a date.
 */
export function ToFloat() {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_FLOAT,
            object: object,
            propertyName: propertyName
        });
    }
}

/**
 * Convert the input to an integer, or NaN if the input is not an integer.
 */
export function ToInt(radix?: number) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_INT,
            object: object,
            propertyName: propertyName,
            value1: radix
        });
    }
}

/**
 * Convert the input to a string.
 */
export function ToString() {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TO_STRING,
            object: object,
            propertyName: propertyName
        });
    }
}

/**
 * Trim characters (whitespace by default) from both sides of the input.
 */
export function Trim(chars?: string[]) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.TRIM,
            object: object,
            propertyName: propertyName,
            value1: chars
        });
    }
}

/**
 * Remove characters that do not appear in the whitelist.
 * The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]').
 */
export function Whitelist(chars: RegExp) {
    return function (object: Object, propertyName: string) {
        defaultMetadataStorage.addValidationMetadata({
            sanitize: true,
            type: SanitizeTypes.WHITELIST,
            object: object,
            propertyName: propertyName,
            value1: chars
        });
    }
}