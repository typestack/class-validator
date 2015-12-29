/**
 * Validation types.
 */
export enum ValidationTypes {
    CONTAINS = 1,
    EQUALS = 2,
    IS_AFTER = 3,
    IS_ALPHA = 4,
    IS_ALPHANUMERIC = 5,
    IS_ASCII = 6,
    IS_BASE64 = 7,
    IS_BEFORE = 8,
    IS_BOOLEAN = 9,
    IS_BYTE_LENGTH = 10,
    IS_CREDIT_CARD = 11,
    IS_CURRENCY = 12,
    IS_DATE = 13,
    IS_DECIMAL = 14,
    IS_DIVISIBLE_BY = 15,
    IS_EMAIL = 16,
    IS_FQDN = 17,
    IS_FLOAT = 18,
    IS_FULL_WIDTH = 19,
    IS_HALF_WIDTH = 20,
    IS_HEX_COLOR = 21,
    IS_HEXADECIMAL = 22,
    IS_IP = 23,
    IS_ISBN = 24,
    IS_ISIN = 25,
    IS_ISO8601 = 26,
    IS_IN = 27,
    IS_INT = 28,
    IS_JSON = 29,
    IS_LENGTH = 30,
    IS_LOWERCASE = 31,
    IS_MOBILE_PHONE = 32,
    IS_MONGO_ID = 33,
    IS_MULTIBYTE = 34,
    IS_NULL = 35,
    IS_NUMERIC = 36,
    IS_SURROGATE_PAIR = 37,
    IS_URL = 38,
    IS_UUID = 39,
    IS_UPPERCASE = 40,
    IS_VARIABLE_WIDTH = 41,
    MATCHES = 42,

    // custom validation types
    MIN_LENGTH = 301,
    MAX_LENGTH = 302,
    MIN_NUMBER = 281,
    MAX_NUMBER = 282,
    NOT_EMPTY = 1001,
    NOT_EMPTY_ARRAY = 1002,
    MIN_SIZE = 1003,
    MAX_SIZE = 1004,

    NESTED_VALIDATION = 0,
    CUSTOM_VALIDATION = 99999
}

export class ValidationTypesUtils {

    static getCodeName(code: number): string {
        switch (code) {
            case ValidationTypes.CONTAINS:
                return "contains";
            case ValidationTypes.EQUALS:
                return "equals";
            case ValidationTypes.IS_AFTER:
                return "after";
            case ValidationTypes.IS_ALPHA:
                return "alpha";
            case ValidationTypes.IS_ALPHANUMERIC:
                return "alphanumeric";
            case ValidationTypes.IS_ASCII:
                return "ascii";
            case ValidationTypes.IS_BASE64:
                return "base64";
            case ValidationTypes.IS_BEFORE:
                return "before";
            case ValidationTypes.IS_BOOLEAN:
                return "boolean";
            case ValidationTypes.IS_BYTE_LENGTH:
                return "byte_length";
            case ValidationTypes.IS_CREDIT_CARD:
                return "credit_card";
            case ValidationTypes.IS_CURRENCY:
                return "currency";
            case ValidationTypes.IS_DATE:
                return "date";
            case ValidationTypes.IS_DECIMAL:
                return "decimal";
            case ValidationTypes.IS_DIVISIBLE_BY:
                return "divisible_by";
            case ValidationTypes.IS_EMAIL:
                return "email";
            case ValidationTypes.IS_FQDN:
                return "fqdn";
            case ValidationTypes.IS_FLOAT:
                return "float";
            case ValidationTypes.IS_FULL_WIDTH:
                return "full_width";
            case ValidationTypes.IS_HALF_WIDTH:
                return "half_width";
            case ValidationTypes.IS_HEX_COLOR:
                return "hex_color";
            case ValidationTypes.IS_HEXADECIMAL:
                return "hexadecimal";
            case ValidationTypes.IS_IP:
                return "ip";
            case ValidationTypes.IS_ISBN:
                return "isbn";
            case ValidationTypes.IS_ISIN:
                return "isin";
            case ValidationTypes.IS_ISO8601:
                return "iso8601";
            case ValidationTypes.IS_IN:
                return "in";
            case ValidationTypes.IS_INT:
                return "int";
            case ValidationTypes.IS_JSON:
                return "json";
            case ValidationTypes.IS_LENGTH:
                return "length";
            case ValidationTypes.IS_LOWERCASE:
                return "lowercase";
            case ValidationTypes.IS_MOBILE_PHONE:
                return "mobile_phone";
            case ValidationTypes.IS_MONGO_ID:
                return "mongo_id";
            case ValidationTypes.IS_MULTIBYTE:
                return "multibyte";
            case ValidationTypes.IS_NULL:
                return "null";
            case ValidationTypes.IS_NUMERIC:
                return "numeric";
            case ValidationTypes.IS_SURROGATE_PAIR:
                return "surrogate_pair";
            case ValidationTypes.IS_URL:
                return "url";
            case ValidationTypes.IS_UUID:
                return "uuid";
            case ValidationTypes.IS_UPPERCASE:
                return "uppercase";
            case ValidationTypes.IS_VARIABLE_WIDTH:
                return "variable_width";
            case ValidationTypes.MATCHES:
                return "matches";

            // custom validation types
            case ValidationTypes.MIN_LENGTH:
                return "min_length";
            case ValidationTypes.MAX_LENGTH:
                return "max_length";
            case ValidationTypes.MIN_NUMBER:
                return "min_number";
            case ValidationTypes.MAX_NUMBER:
                return "max_number";
            case ValidationTypes.NOT_EMPTY:
                return "not_empty";
            case ValidationTypes.NOT_EMPTY_ARRAY:
                return "not_empty_array";
            case ValidationTypes.MIN_SIZE:
                return "min_size";
            case ValidationTypes.MAX_SIZE:
                return "max_size";
        }
    }

}