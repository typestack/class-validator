
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
    MATCHES = 42
}

export class ValidationTypesUtils {

    static getCodeName(code: number): string {
        switch (code) {
            case ValidationTypes.CONTAINS:
                return 'contains';
            case ValidationTypes.EQUALS:
                return 'equals';
            case ValidationTypes.IS_AFTER:
                return 'is_after';
            case ValidationTypes.IS_ALPHA:
                return 'is_alpha';
            case ValidationTypes.IS_ALPHANUMERIC:
                return 'is_alphanumeric';
            case ValidationTypes.IS_ASCII:
                return 'is_ascii';
            case ValidationTypes.IS_BASE64:
                return 'is_base64';
            case ValidationTypes.IS_BEFORE:
                return 'is_before';
            case ValidationTypes.IS_BOOLEAN:
                return 'is_boolean';
            case ValidationTypes.IS_BYTE_LENGTH:
                return 'is_byte_length';
            case ValidationTypes.IS_CREDIT_CARD:
                return 'is_credit_card';
            case ValidationTypes.IS_CURRENCY:
                return 'is_currency';
            case ValidationTypes.IS_DATE:
                return 'is_date';
            case ValidationTypes.IS_DECIMAL:
                return 'is_decimal';
            case ValidationTypes.IS_DIVISIBLE_BY:
                return 'is_divisible_by';
            case ValidationTypes.IS_EMAIL:
                return 'is_email';
            case ValidationTypes.IS_FQDN:
                return 'is_fqdn';
            case ValidationTypes.IS_FLOAT:
                return 'is_float';
            case ValidationTypes.IS_FULL_WIDTH:
                return 'is_full_width';
            case ValidationTypes.IS_HALF_WIDTH:
                return 'is_half_width';
            case ValidationTypes.IS_HEX_COLOR:
                return 'is_hex_color';
            case ValidationTypes.IS_HEXADECIMAL:
                return 'is_hexadecimal';
            case ValidationTypes.IS_IP:
                return 'is_ip';
            case ValidationTypes.IS_ISBN:
                return 'is_isbn';
            case ValidationTypes.IS_ISIN:
                return 'is_isin';
            case ValidationTypes.IS_ISO8601:
                return 'is_iso8601';
            case ValidationTypes.IS_IN:
                return 'is_in';
            case ValidationTypes.IS_INT:
                return 'is_int';
            case ValidationTypes.IS_JSON:
                return 'is_json';
            case ValidationTypes.IS_LENGTH:
                return 'is_length';
            case ValidationTypes.IS_LOWERCASE:
                return 'is_lowercase';
            case ValidationTypes.IS_MOBILE_PHONE:
                return 'is_mobile_phone';
            case ValidationTypes.IS_MONGO_ID:
                return 'is_mongo_id';
            case ValidationTypes.IS_MULTIBYTE:
                return 'is_multibyte';
            case ValidationTypes.IS_NULL:
                return 'is_null';
            case ValidationTypes.IS_NUMERIC:
                return 'is_numeric';
            case ValidationTypes.IS_SURROGATE_PAIR:
                return 'is_surrogate_pair';
            case ValidationTypes.IS_URL:
                return 'is_url';
            case ValidationTypes.IS_UUID:
                return 'is_uuid';
            case ValidationTypes.IS_UPPERCASE:
                return 'is_uppercase';
            case ValidationTypes.IS_VARIABLE_WIDTH:
                return 'is_variable_width';
            case ValidationTypes.MATCHES:
                return 'matches';
        }
    }

}