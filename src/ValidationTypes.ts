/**
 * Validation types.
 */
export class ValidationTypes {
    
    /* system */
    static CUSTOM_VALIDATION = "custom_validation";
    static NESTED_VALIDATION = "nested_validation";

    /* common checkers */
    static IS_EQUAL = "equal";
    static IS_NOT_EQUAL = "not_equal";
    static IS_EMPTY = "empty";
    static IS_NOT_EMPTY = "not_empty";
    static IS_IN = "in";
    static IS_NOT_IN = "not_in";

    /* type checkers */
    static IS_BOOLEAN = "boolean";
    static IS_DATE = "date";
    static IS_NUMBER = "number";
    static IS_STRING = "string";

    /* number checkers */
    static IS_DIVISIBLE_BY = "divisible_by";
    static IS_DECIMAL = "decimal";
    static IS_FLOAT = "float";
    static IS_POSITIVE_FLOAT = "positive_float";
    static IS_NEGATIVE_FLOAT = "negative_float";
    static IS_INT = "int";
    static IS_POSITIVE_INT = "positive_int";
    static IS_NEGATIVE_INT = "negative_int";
    static IS_GREATER = "greater";
    static IS_LESS = "less";

    /* date checkers */
    static IS_MIN_DATE = "min_date";
    static IS_MAX_DATE = "max_date";

    /* regexp checkers */
    static IS_MATCH = "match";

    /* string-as-types checkers */
    static IS_BOOLEAN_STRING = "boolean_string";
    static IS_DATE_STRING = "date_string";
    static IS_NUMERIC_STRING = "numeric_string";

    /* string checkers */
    static IS_CONTAIN = "contain";
    static IS_NOT_CONTAIN = "not_contain";
    static IS_ALPHA = "alpha";
    static IS_ALPHANUMERIC = "alphanumeric";
    static IS_ASCII = "ascii";
    static IS_BASE64 = "base64";
    static IS_BYTE_LENGTH = "byte_length";
    static IS_CREDIT_CARD = "credit_card";
    static IS_CURRENCY = "currency";
    static IS_EMAIL = "email";
    static IS_FQDN = "fqdn";
    static IS_FULL_WIDTH = "full_width";
    static IS_HALF_WIDTH = "half_width";
    static IS_VARIABLE_WIDTH = "variable_width";
    static IS_HEX_COLOR = "hex_color";
    static IS_HEXADECIMAL = "hexadecimal";
    static IS_IP = "ip";
    static IS_ISBN = "isbn";
    static IS_ISIN = "isin";
    static IS_ISO8601 = "iso8601";
    static IS_JSON = "json";
    static IS_LENGTH = "length";
    static IS_LOWERCASE = "lowercase";
    static IS_MOBILE_PHONE = "mobile_phone";
    static IS_MONGO_ID = "mongo_id";
    static IS_MULTIBYTE = "multibyte";
    static IS_SURROGATE_PAIR = "surrogate_pair";
    static IS_URL = "url";
    static IS_UUID = "uuid";
    static IS_UPPERCASE = "uppercase";
    static MIN_LENGTH = "min_length";
    static MAX_LENGTH = "max_length";

    /* array checkers */
    static IS_CONTAIN_IN_ARRAY = "contain_in_array";
    static IS_NOT_CONTAIN_IN_ARRAY = "not_contain_in_array";
    static IS_NOT_EMPTY_ARRAY = "not_empty_array";
    static IS_MIN_SIZE = "min_size";
    static IS_MAX_SIZE = "max_size";
    static IS_ALL_UNIQUE = "all_unique";
    
}