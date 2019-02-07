import { ValidationArguments } from "./ValidationArguments";
/**
 * Validation types.
 */
export declare class ValidationTypes {
    static CUSTOM_VALIDATION: string;
    static NESTED_VALIDATION: string;
    static CONDITIONAL_VALIDATION: string;
    static WHITELIST: string;
    static IS_DEFINED: string;
    static EQUALS: string;
    static NOT_EQUALS: string;
    static IS_EMPTY: string;
    static IS_NOT_EMPTY: string;
    static IS_IN: string;
    static IS_NOT_IN: string;
    static IS_BOOLEAN: string;
    static IS_DATE: string;
    static IS_NUMBER: string;
    static IS_STRING: string;
    static IS_DATE_STRING: string;
    static IS_ARRAY: string;
    static IS_INT: string;
    static IS_ENUM: string;
    static IS_DIVISIBLE_BY: string;
    static IS_POSITIVE: string;
    static IS_NEGATIVE: string;
    static MIN: string;
    static MAX: string;
    static MIN_DATE: string;
    static MAX_DATE: string;
    static IS_BOOLEAN_STRING: string;
    static IS_NUMBER_STRING: string;
    static CONTAINS: string;
    static NOT_CONTAINS: string;
    static IS_ALPHA: string;
    static IS_ALPHANUMERIC: string;
    static IS_ASCII: string;
    static IS_BASE64: string;
    static IS_BYTE_LENGTH: string;
    static IS_CREDIT_CARD: string;
    static IS_CURRENCY: string;
    static IS_EMAIL: string;
    static IS_FQDN: string;
    static IS_FULL_WIDTH: string;
    static IS_HALF_WIDTH: string;
    static IS_VARIABLE_WIDTH: string;
    static IS_HEX_COLOR: string;
    static IS_HEXADECIMAL: string;
    static IS_IP: string;
    static IS_ISBN: string;
    static IS_ISIN: string;
    static IS_ISO8601: string;
    static IS_JSON: string;
    static IS_LOWERCASE: string;
    static IS_MOBILE_PHONE: string;
    static IS_PHONE_NUMBER: string;
    static IS_MONGO_ID: string;
    static IS_MULTIBYTE: string;
    static IS_SURROGATE_PAIR: string;
    static IS_URL: string;
    static IS_UUID: string;
    static LENGTH: string;
    static IS_UPPERCASE: string;
    static MIN_LENGTH: string;
    static MAX_LENGTH: string;
    static MATCHES: string;
    static IS_MILITARY_TIME: string;
    static ARRAY_CONTAINS: string;
    static ARRAY_NOT_CONTAINS: string;
    static ARRAY_NOT_EMPTY: string;
    static ARRAY_MIN_SIZE: string;
    static ARRAY_MAX_SIZE: string;
    static ARRAY_UNIQUE: string;
    static IS_INSTANCE: string;
    /**
     * Checks if validation type is valid.
     */
    static isValid(type: string): boolean;
    /**
     * Gets default validation error message for the given validation type.
     */
    static getMessage(type: string, isEach: boolean): string | ((args: ValidationArguments) => string);
}
//# sourceMappingURL=ValidationTypes.d.ts.map