"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validation types.
 */
var ValidationTypes = /** @class */ (function () {
    function ValidationTypes() {
    }
    /**
     * Checks if validation type is valid.
     */
    ValidationTypes.isValid = function (type) {
        var _this = this;
        return type !== "isValid" &&
            type !== "getMessage" &&
            Object.keys(this).map(function (key) { return _this[key]; }).indexOf(type) !== -1;
    };
    /**
     * Gets default validation error message for the given validation type.
     */
    ValidationTypes.getMessage = function (type, isEach) {
        var _this = this;
        var eachPrefix = isEach ? "each value in " : "";
        switch (type) {
            /* system chceck */
            case this.NESTED_VALIDATION:
                return eachPrefix + "nested property $property must be either object or array";
            /* common checkers */
            case this.IS_DEFINED:
                return eachPrefix + "$property should not be null or undefined";
            case this.EQUALS:
                return eachPrefix + "$property must be equal to $constraint1";
            case this.NOT_EQUALS:
                return eachPrefix + "$property should not be equal to $constraint1";
            case this.IS_EMPTY:
                return eachPrefix + "$property must be empty";
            case this.IS_NOT_EMPTY:
                return eachPrefix + "$property should not be empty";
            case this.IS_IN:
                return eachPrefix + "$property must be one of the following values: $constraint1";
            case this.IS_NOT_IN:
                return eachPrefix + "$property should not be one of the following values: $constraint1";
            /* type checkers */
            case this.IS_BOOLEAN:
                return eachPrefix + "$property must be a boolean value";
            case this.IS_DATE:
                return eachPrefix + "$property must be a Date instance";
            case this.IS_NUMBER:
                return eachPrefix + "$property must be a number";
            case this.IS_INT:
                return eachPrefix + "$property must be an integer number";
            case this.IS_STRING:
                return eachPrefix + "$property must be a string";
            case this.IS_DATE_STRING:
                return eachPrefix + "$property must be a ISOString";
            case this.IS_ARRAY:
                return eachPrefix + "$property must be an array";
            case this.IS_ENUM:
                return eachPrefix + "$property must be a valid enum value";
            /* number checkers */
            case this.IS_DIVISIBLE_BY:
                return eachPrefix + "$property must be divisible by $constraint1";
            case this.IS_POSITIVE:
                return eachPrefix + "$property must be a positive number";
            case this.IS_NEGATIVE:
                return eachPrefix + "$property must be a negative number";
            case this.MIN:
                return eachPrefix + "$property must not be less than $constraint1";
            case this.MAX:
                return eachPrefix + "$property must not be greater than $constraint1";
            /* date checkers */
            case this.MIN_DATE:
                return "minimal allowed date for " + eachPrefix + "$property is $constraint1";
            case this.MAX_DATE:
                return "maximal allowed date for " + eachPrefix + "$property is $constraint1";
            /* string-as-type checkers */
            case this.IS_BOOLEAN_STRING:
                return eachPrefix + "$property must be a boolean string";
            case this.IS_NUMBER_STRING:
                return eachPrefix + "$property must be a number string";
            /* string checkers */
            case this.CONTAINS:
                return eachPrefix + "$property must contain a $constraint1 string";
            case this.NOT_CONTAINS:
                return eachPrefix + "$property should not contain a $constraint1 string";
            case this.IS_ALPHA:
                return eachPrefix + "$property must contain only letters (a-zA-Z)";
            case this.IS_ALPHANUMERIC:
                return eachPrefix + "$property must contain only letters and numbers";
            case this.IS_ASCII:
                return eachPrefix + "$property must contain only ASCII characters";
            case this.IS_BASE64:
                return eachPrefix + "$property must be base64 encoded";
            case this.IS_BYTE_LENGTH:
                return eachPrefix + "$property's byte length must fall into ($constraint1, $constraint2) range";
            case this.IS_CREDIT_CARD:
                return eachPrefix + "$property must be a credit card";
            case this.IS_CURRENCY:
                return eachPrefix + "$property must be a currency";
            case this.IS_EMAIL:
                return eachPrefix + "$property must be an email";
            case this.IS_FQDN:
                return eachPrefix + "$property must be a valid domain name";
            case this.IS_FULL_WIDTH:
                return eachPrefix + "$property must contain a full-width characters";
            case this.IS_HALF_WIDTH:
                return eachPrefix + "$property must contain a half-width characters";
            case this.IS_VARIABLE_WIDTH:
                return eachPrefix + "$property must contain a full-width and half-width characters";
            case this.IS_HEX_COLOR:
                return eachPrefix + "$property must be a hexadecimal color";
            case this.IS_HEXADECIMAL:
                return eachPrefix + "$property must be a hexadecimal number";
            case this.IS_IP:
                return eachPrefix + "$property must be an ip address";
            case this.IS_ISBN:
                return eachPrefix + "$property must be an ISBN";
            case this.IS_ISIN:
                return eachPrefix + "$property must be an ISIN (stock/security identifier)";
            case this.IS_ISO8601:
                return eachPrefix + "$property must be a valid ISO 8601 date string";
            case this.IS_JSON:
                return eachPrefix + "$property must be a json string";
            case this.IS_LOWERCASE:
                return eachPrefix + "$property must be a lowercase string";
            case this.IS_MOBILE_PHONE:
                return eachPrefix + "$property must be a phone number";
            case this.IS_PHONE_NUMBER:
                return eachPrefix + "$property must be a valid phone number";
            case this.IS_MONGO_ID:
                return eachPrefix + "$property must be a mongodb id";
            case this.IS_MULTIBYTE:
                return eachPrefix + "$property must contain one or more multibyte chars";
            case this.IS_SURROGATE_PAIR:
                return eachPrefix + "$property must contain any surrogate pairs chars";
            case this.IS_URL:
                return eachPrefix + "$property must be an URL address";
            case this.IS_UUID:
                return eachPrefix + "$property must be an UUID";
            case this.IS_UPPERCASE:
                return eachPrefix + "$property must be uppercase";
            case this.LENGTH:
                return function (args) {
                    var isMinLength = args.constraints[0] !== null && args.constraints[0] !== undefined;
                    var isMaxLength = args.constraints[1] !== null && args.constraints[1] !== undefined;
                    if (isMinLength && (!args.value || args.value.length < args.constraints[0])) {
                        return eachPrefix + "$property must be longer than or equal to $constraint1 characters";
                    }
                    else if (isMaxLength && (args.value.length > args.constraints[1])) {
                        return eachPrefix + "$property must be shorter than or equal to $constraint2 characters";
                    }
                    return eachPrefix + "$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters";
                };
            case this.MIN_LENGTH:
                return eachPrefix + "$property must be longer than or equal to $constraint1 characters";
            case this.MAX_LENGTH:
                return eachPrefix + "$property must be shorter than or equal to $constraint1 characters";
            case this.MATCHES:
                return eachPrefix + "$property must match $constraint1 regular expression";
            /* array checkers */
            case this.ARRAY_CONTAINS:
                return eachPrefix + "$property must contain $constraint1 values";
            case this.ARRAY_NOT_CONTAINS:
                return eachPrefix + "$property should not contain $constraint1 values";
            case this.ARRAY_NOT_EMPTY:
                return eachPrefix + "$property should not be empty";
            case this.ARRAY_MIN_SIZE:
                return eachPrefix + "$property must contain at least $constraint1 elements";
            case this.ARRAY_MAX_SIZE:
                return eachPrefix + "$property must contain not more than $constraint1 elements";
            case this.ARRAY_UNIQUE:
                return eachPrefix + "All $property's elements must be unique";
            case this.IS_INSTANCE:
                return function (args) {
                    if (args.constraints[0]) {
                        return eachPrefix + ("$property must be an instance of " + args.constraints[0].name);
                    }
                    else {
                        return eachPrefix + (_this.IS_INSTANCE + " decorator expects and object as value, but got falsy value.");
                    }
                };
        }
        return "";
    };
    /* system */
    ValidationTypes.CUSTOM_VALIDATION = "customValidation";
    ValidationTypes.NESTED_VALIDATION = "nestedValidation";
    ValidationTypes.CONDITIONAL_VALIDATION = "conditionalValidation";
    ValidationTypes.WHITELIST = "whitelistValidation";
    /* common checkers */
    ValidationTypes.IS_DEFINED = "isDefined";
    ValidationTypes.EQUALS = "equals";
    ValidationTypes.NOT_EQUALS = "notEquals";
    ValidationTypes.IS_EMPTY = "isEmpty";
    ValidationTypes.IS_NOT_EMPTY = "isNotEmpty";
    ValidationTypes.IS_IN = "isIn";
    ValidationTypes.IS_NOT_IN = "isNotIn";
    /* type checkers */
    ValidationTypes.IS_BOOLEAN = "isBoolean";
    ValidationTypes.IS_DATE = "isDate";
    ValidationTypes.IS_NUMBER = "isNumber";
    ValidationTypes.IS_STRING = "isString";
    ValidationTypes.IS_DATE_STRING = "isDateString";
    ValidationTypes.IS_ARRAY = "isArray";
    ValidationTypes.IS_INT = "isInt";
    ValidationTypes.IS_ENUM = "isEnum";
    /* number checkers */
    ValidationTypes.IS_DIVISIBLE_BY = "isDivisibleBy";
    ValidationTypes.IS_POSITIVE = "isPositive";
    ValidationTypes.IS_NEGATIVE = "isNegative";
    ValidationTypes.MIN = "min";
    ValidationTypes.MAX = "max";
    /* date checkers */
    ValidationTypes.MIN_DATE = "minDate";
    ValidationTypes.MAX_DATE = "maxDate";
    /* string-as-type checkers */
    ValidationTypes.IS_BOOLEAN_STRING = "isBooleanString";
    ValidationTypes.IS_NUMBER_STRING = "isNumberString";
    /* string checkers */
    ValidationTypes.CONTAINS = "contains";
    ValidationTypes.NOT_CONTAINS = "notContains";
    ValidationTypes.IS_ALPHA = "isAlpha";
    ValidationTypes.IS_ALPHANUMERIC = "isAlphanumeric";
    ValidationTypes.IS_ASCII = "isAscii";
    ValidationTypes.IS_BASE64 = "isBase64";
    ValidationTypes.IS_BYTE_LENGTH = "isByteLength";
    ValidationTypes.IS_CREDIT_CARD = "isCreditCard";
    ValidationTypes.IS_CURRENCY = "isCurrency";
    ValidationTypes.IS_EMAIL = "isEmail";
    ValidationTypes.IS_FQDN = "isFqdn";
    ValidationTypes.IS_FULL_WIDTH = "isFullWidth";
    ValidationTypes.IS_HALF_WIDTH = "isHalfWidth";
    ValidationTypes.IS_VARIABLE_WIDTH = "isVariableWidth";
    ValidationTypes.IS_HEX_COLOR = "isHexColor";
    ValidationTypes.IS_HEXADECIMAL = "isHexadecimal";
    ValidationTypes.IS_IP = "isIp";
    ValidationTypes.IS_ISBN = "isIsbn";
    ValidationTypes.IS_ISIN = "isIsin";
    ValidationTypes.IS_ISO8601 = "isIso8601";
    ValidationTypes.IS_JSON = "isJson";
    ValidationTypes.IS_LOWERCASE = "isLowercase";
    ValidationTypes.IS_MOBILE_PHONE = "isMobilePhone";
    ValidationTypes.IS_PHONE_NUMBER = "isPhoneNumber";
    ValidationTypes.IS_MONGO_ID = "isMongoId";
    ValidationTypes.IS_MULTIBYTE = "isMultibyte";
    ValidationTypes.IS_SURROGATE_PAIR = "isSurrogatePair";
    ValidationTypes.IS_URL = "isUrl";
    ValidationTypes.IS_UUID = "isUuid";
    ValidationTypes.LENGTH = "length";
    ValidationTypes.IS_UPPERCASE = "isUppercase";
    ValidationTypes.MIN_LENGTH = "minLength";
    ValidationTypes.MAX_LENGTH = "maxLength";
    ValidationTypes.MATCHES = "matches";
    ValidationTypes.IS_MILITARY_TIME = "isMilitaryTime";
    /* array checkers */
    ValidationTypes.ARRAY_CONTAINS = "arrayContains";
    ValidationTypes.ARRAY_NOT_CONTAINS = "arrayNotContains";
    ValidationTypes.ARRAY_NOT_EMPTY = "arrayNotEmpty";
    ValidationTypes.ARRAY_MIN_SIZE = "arrayMinSize";
    ValidationTypes.ARRAY_MAX_SIZE = "arrayMaxSize";
    ValidationTypes.ARRAY_UNIQUE = "arrayUnique";
    /* object chekers */
    ValidationTypes.IS_INSTANCE = "isInstance";
    return ValidationTypes;
}());
exports.ValidationTypes = ValidationTypes;

//# sourceMappingURL=ValidationTypes.js.map
