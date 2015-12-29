/**
 * Sanitization types.
 */
export enum SanitizeTypes {
    BLACKLIST = 1,
    ESCAPE = 2,
    LTRIM = 3,
    NORMALIZE_EMAIL = 4,
    RTRIM = 5,
    STRIP_LOW = 6,
    TO_BOOLEAN = 7,
    TO_DATE = 8,
    TO_FLOAT = 9,
    TO_INT = 10,
    TO_STRING = 11,
    TRIM = 12,
    WHITELIST = 13,
    CUSTOM_SANITIZATION = 9999
}