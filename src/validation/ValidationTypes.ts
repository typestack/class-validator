/**
 * Validation types.
 */
export class ValidationTypes {
    
    /* system */
    static CUSTOM_VALIDATION = "custom_validation";
    static NESTED_VALIDATION = "nested_validation";

    /* common checkers */
    static EQUALS = "equal";
    static NOT_EQUALS = "not_equal";
    static EMPTY = "empty";
    static NOT_EMPTY = "not_empty";
    static IN = "in";
    static NOT_IN = "not_in";

    /* type checkers */
    static IS_BOOLEAN = "is_boolean";
    static IS_DATE = "is_date";
    static IS_NUMBER = "is_number";
    static IS_STRING = "is_string";

    /* number checkers */
    static DIVISIBLE_BY = "divisible_by";
    static IS_DECIMAL = "is_decimal";
    static IS_INT = "is_int";
    static IS_POSITIVE = "is_positive";
    static IS_NEGATIVE = "is_negative";
    static GREATER_THEN = "greater";
    static LESS_THEN = "less";

    /* date checkers */
    static MIN_DATE = "min_date";
    static MAX_DATE = "max_date";

    /* regexp checkers */
    static MATCHES = "matches";

    /* string-as-type checkers */
    static IS_BOOLEAN_STRING = "is_boolean_string";
    static IS_DATE_STRING = "is_date_string";
    static IS_NUMBER_STRING = "is_number_string";

    /* string checkers */
    static CONTAINS = "contains";
    static NOT_CONTAINS = "not_contains";
    static IS_ALPHA = "is_alpha";
    static IS_ALPHANUMERIC = "is_alphanumeric";
    static IS_ASCII = "is_ascii";
    static IS_BASE64 = "is_base64";
    static IS_BYTE_LENGTH = "is_byte_length";
    static IS_CREDIT_CARD = "is_credit_card";
    static IS_CURRENCY = "is_currency";
    static IS_EMAIL = "is_email";
    static IS_FQDN = "is_fqdn";
    static IS_FULL_WIDTH = "is_full_width";
    static IS_HALF_WIDTH = "is_half_width";
    static IS_VARIABLE_WIDTH = "is_variable_width";
    static IS_HEX_COLOR = "is_hex_color";
    static IS_HEXADECIMAL = "is_hexadecimal";
    static IS_IP = "is_ip";
    static IS_ISBN = "is_isbn";
    static IS_ISIN = "is_isin";
    static IS_ISO8601 = "is_iso8601";
    static IS_JSON = "is_json";
    static IS_LOWERCASE = "is_lowercase";
    static IS_MOBILE_PHONE = "is_mobile_phone";
    static IS_MONGO_ID = "is_mongo_id";
    static IS_MULTIBYTE = "is_multibyte";
    static IS_SURROGATE_PAIR = "is_surrogate_pair";
    static IS_URL = "is_url";
    static IS_UUID = "is_uuid";
    static LENGTH = "length";
    static IS_UPPERCASE = "is_uppercase";
    static MIN_LENGTH = "min_length";
    static MAX_LENGTH = "max_length";

    /* array checkers */
    static ARRAY_CONTAINS = "array_contains";
    static ARRAY_NOT_CONTAINS = "array_not_contains";
    static ARRAY_NOT_EMPTY = "array_not_empty";
    static ARRAY_MIN_SIZE = "array_min_size";
    static ARRAY_MAX_SIZE = "array_max_size";
    static ARRAY_UNIQUE = "array_unique";

    /**
     * Checks if validation type is valid.
     */
    static isValid(type: string) {
        return type !== "isValid" && Object.keys(this).map(key => (this as any)[key]).indexOf(type) !== -1;
    }
    
}