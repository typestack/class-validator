import {MessageArguments} from "./MessageArguments";

/**
 * Validation types.
 */
export class ValidationTypes {
    
    /* system */
    static CUSTOM_VALIDATION = "custom_validation";
    static NESTED_VALIDATION = "nested_validation";

    /* common checkers */
    static IS_DEFINED = "is_defined";
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
    static IS_DECIMAL = "is_decimal";
    static IS_INT = "is_int";

    /* number checkers */
    static DIVISIBLE_BY = "divisible_by";
    static IS_POSITIVE = "is_positive";
    static IS_NEGATIVE = "is_negative";
    static GREATER_THEN = "greater";
    static LESS_THEN = "less";

    /* date checkers */
    static MIN_DATE = "min_date";
    static MAX_DATE = "max_date";

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
    static MATCHES = "matches";

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
        return  type !== "isValid" &&
                type !== "getMessage" &&
                Object.keys(this).map(key => (this as any)[key]).indexOf(type) !== -1;
    }

    /**
     * Gets default validation error message for the given validation type.
     */
    static getMessage(type: string): string|((args: MessageArguments) => string) {
        switch (type) {

            /* common checkers */
            case this.IS_DEFINED:
                return "$property is missing, but its required";
            case this.EQUALS:
                return "$property must be equal to $constraint1";
            case this.NOT_EQUALS:
                return "$property should not be equal to $constraint1";
            case this.EMPTY:
                return "$property must be empty";
            case this.NOT_EMPTY:
                return "$property should not be empty";
            case this.IN:
                return "$property must be one of the following values: $constraint1";
            case this.NOT_IN:
                return "$property should not be one of the following values: $constraint1";

            /* type checkers */
            case this.IS_BOOLEAN:
                return "$property must be a boolean value";
            case this.IS_DATE:
                return "$property must be a Date instance";
            case this.IS_NUMBER:
                return "$property must be a number";
            case this.IS_STRING:
                return "$property must be a string";
            case this.IS_DECIMAL:
                return "$property must be a decimal number";
            case this.IS_INT:
                return "$property must be an integer number";

            /* number checkers */
            case this.DIVISIBLE_BY:
                return "$property must be divisible by $constraint1";
            case this.IS_POSITIVE:
                return "$property must be a positive number";
            case this.IS_NEGATIVE:
                return "$property must be a negative number";
            case this.GREATER_THEN:
                return "$property must be greater then $constraint1";
            case this.LESS_THEN:
                return "$property must be less then $constraint1";

            /* date checkers */
            case this.MIN_DATE:
                return "Minimal allowed date for $property is $constraint1";
            case this.MAX_DATE:
                return "Minimal allowed date for $property is $constraint1";

            /* string-as-type checkers */
            case this.IS_BOOLEAN_STRING:
                return "$property must be a boolean string";
            case this.IS_DATE_STRING:
                return "$property must be a date string";
            case this.IS_NUMBER_STRING:
                return "$property must be a number string";

            /* string checkers */
            case this.CONTAINS:
                return "$property must contain a $constraint1 string";
            case this.NOT_CONTAINS:
                return "$property should not contain a $constraint1 string";
            case this.IS_ALPHA:
                return "$property must contain only letters (a-zA-Z)";
            case this.IS_ALPHANUMERIC:
                return "$property must contain only letters and numbers";
            case this.IS_ASCII:
                return "$property must contain only ASCII characters";
            case this.IS_BASE64:
                return "$property must be base64 encoded";
            case this.IS_BYTE_LENGTH:
                return "$property's byte length must fall into ($constraint1, $constraint2) range";
            case this.IS_CREDIT_CARD:
                return "$property must be a credit card";
            case this.IS_CURRENCY:
                return "$property must be a currency";
            case this.IS_EMAIL:
                return "$property must be an email";
            case this.IS_FQDN:
                return "$property must be a valid domain name";
            case this.IS_FULL_WIDTH:
                return "$property must contain a full-width characters";
            case this.IS_HALF_WIDTH:
                return "$property must contain a half-width characters";
            case this.IS_VARIABLE_WIDTH:
                return "$property must contain a full-width and half-width characters";
            case this.IS_HEX_COLOR:
                return "$property must be a hexadecimal color";
            case this.IS_HEXADECIMAL:
                return "$property must be a hexadecimal number";
            case this.IS_IP:
                return "$property must be an ip address";
            case this.IS_ISBN:
                return "$property must be an ISBN";
            case this.IS_ISIN:
                return "$property must be an ISIN (stock/security identifier)";
            case this.IS_ISO8601:
                return "$property must be a valid ISO 8601 date string";
            case this.IS_JSON:
                return "$property must be a json string";
            case this.IS_LOWERCASE:
                return "$property must be a lowercase string";
            case this.IS_MOBILE_PHONE:
                return "$property must be a phone number";
            case this.IS_MONGO_ID:
                return "$property must be a mongodb id";
            case this.IS_MULTIBYTE:
                return "$property must contain one or more multibyte chars";
            case this.IS_SURROGATE_PAIR:
                return "$property must contain any surrogate pairs chars";
            case this.IS_URL:
                return "$property must be an URL address";
            case this.IS_UUID:
                return "$property must be an UUID";
            case this.IS_UPPERCASE:
                return "$property must be uppercase";
            case this.LENGTH:
                return (args: MessageArguments) => {
                    const isMinLength = args.constraints[0] !== null && args.constraints[0] !== undefined;
                    const isMaxLength = args.constraints[1] !== null && args.constraints[1] !== undefined;
                    if (isMinLength && (!args.value || args.value.length < args.constraints[0])) {
                        return "$property must be longer then $constraint1";
                    } else if (isMaxLength && (args.value.length > args.constraints[1])) {
                        return "$property must be shorter then $constraint2";
                    }
                    return "$property must be longer then $constraint1 and shorter then $constraint2";
                };
            case this.MIN_LENGTH:
                return "$property must be longer then $constraint1";
            case this.MAX_LENGTH:
                return "$property must be shorter then $constraint2";
            case this.MATCHES:
                return "$property must match $constraint1 regular expression";

            /* array checkers */
            case this.ARRAY_CONTAINS:
                return "$property must contain $constraint1 values";
            case this.ARRAY_NOT_CONTAINS:
                return "$property should not contain $constraint1 values";
            case this.ARRAY_NOT_EMPTY:
                return "$property should not be empty";
            case this.ARRAY_MIN_SIZE:
                return "$property must contain at least $constraint1 elements";
            case this.ARRAY_MAX_SIZE:
                return "$property must contain not more then $constraint1 elements";
            case this.ARRAY_UNIQUE:
                return "All $property's elements must be unique";
        }
    }
    
}