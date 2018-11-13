import {ValidationArguments} from "./ValidationArguments";

/**
 * Validation types.
 */
export class ValidationTypes {

    /* system */
    static CUSTOM_VALIDATION = "customValidation";
    static NESTED_VALIDATION = "nestedValidation";
    static CONDITIONAL_VALIDATION = "conditionalValidation";
    static WHITELIST = "whitelistValidation";
    // FIXME: delete?
    static IS_DEFINED = "isDefined";

    /* string checkers */
    static NOT_CONTAINS = "notContains";
    static IS_ALPHA = "isAlpha";
    static IS_ALPHANUMERIC = "isAlphanumeric";
    static IS_ASCII = "isAscii";
    static IS_BASE64 = "isBase64";
    static IS_BYTE_LENGTH = "isByteLength";
    static IS_CREDIT_CARD = "isCreditCard";
    static IS_CURRENCY = "isCurrency";
    static IS_EMAIL = "isEmail";
    static IS_FQDN = "isFqdn";
    static IS_FULL_WIDTH = "isFullWidth";
    static IS_HALF_WIDTH = "isHalfWidth";
    static IS_VARIABLE_WIDTH = "isVariableWidth";
    static IS_HEX_COLOR = "isHexColor";
    static IS_HEXADECIMAL = "isHexadecimal";
    static IS_IP = "isIp";
    static IS_ISBN = "isIsbn";
    static IS_ISIN = "isIsin";
    static IS_ISO8601 = "isIso8601";
    static IS_JSON = "isJson";
    static IS_LOWERCASE = "isLowercase";
    static IS_MOBILE_PHONE = "isMobilePhone";
    static IS_MONGO_ID = "isMongoId";
    static IS_MULTIBYTE = "isMultibyte";
    static IS_SURROGATE_PAIR = "isSurrogatePair";
    static IS_URL = "isUrl";
    static IS_UUID = "isUuid";
    static LENGTH = "length";
    static IS_UPPERCASE = "isUppercase";
    static MIN_LENGTH = "minLength";
    static MAX_LENGTH = "maxLength";
    static MATCHES = "matches";
    static IS_MILITARY_TIME = "isMilitaryTime";

    /* array checkers */
    static ARRAY_CONTAINS = "arrayContains";
    static ARRAY_NOT_CONTAINS = "arrayNotContains";
    static ARRAY_NOT_EMPTY = "arrayNotEmpty";
    static ARRAY_MIN_SIZE = "arrayMinSize";
    static ARRAY_MAX_SIZE = "arrayMaxSize";
    static ARRAY_UNIQUE = "arrayUnique";

    /* object chekers */
    static IS_INSTANCE = "isInstance";

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
    static getMessage(type: string, isEach: boolean): string|((args: ValidationArguments) => string) {
        const eachPrefix = isEach ? "each value in " : "";
        switch (type) {

            /* system chceck */
            case this.NESTED_VALIDATION:
                return eachPrefix + "nested property $property must be either object or array";
            case this.IS_DEFINED:
                return eachPrefix + "$property should not be null or undefined";

            /* string checkers */
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
                return (args: ValidationArguments) => {
                    const isMinLength = args.constraints[0] !== null && args.constraints[0] !== undefined;
                    const isMaxLength = args.constraints[1] !== null && args.constraints[1] !== undefined;
                    if (isMinLength && (!args.value || args.value.length < args.constraints[0])) {
                        return eachPrefix + "$property must be longer than or equal to $constraint1 characters";
                    } else if (isMaxLength && (args.value.length > args.constraints[1])) {
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
                return (args: ValidationArguments) => {
                    if (args.constraints[0]) {
                        return eachPrefix + `$property must be an instance of ${args.constraints[0].name}`;
                    } else {
                        return eachPrefix + `${this.IS_INSTANCE} decorator expects and object as value, but got falsy value.`;
                    }
                };
            default:
                return "";
        }
    }

}
