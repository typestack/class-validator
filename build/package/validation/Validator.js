"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationTypes_1 = require("./ValidationTypes");
var ValidationExecutor_1 = require("./ValidationExecutor");
/**
 * Validator performs validation of the given object based on its metadata.
 */
var Validator = /** @class */ (function () {
    function Validator() {
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        this.validatorJs = require("validator");
        this.libPhoneNumber = {
            phoneUtil: require("google-libphonenumber").PhoneNumberUtil.getInstance(),
        };
    }
    /**
     * Performs validation of the given object based on decorators or validation schema.
     * Common method for `validateOrReject` and `validate` methods.
     */
    Validator.prototype.coreValidate = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        var object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions : objectOrSchemaName;
        var options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions;
        var schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName : undefined;
        var executor = new ValidationExecutor_1.ValidationExecutor(this, options);
        var validationErrors = [];
        executor.execute(object, schema, validationErrors);
        return Promise.all(executor.awaitingPromises).then(function () {
            return executor.stripEmptyErrors(validationErrors);
        });
    };
    /**
     * Performs validation of the given object based on decorators or validation schema.
     */
    Validator.prototype.validate = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        return this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
    };
    /**
     * Performs validation of the given object based on decorators or validation schema and reject on error.
     */
    Validator.prototype.validateOrReject = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions)];
                    case 1:
                        errors = _a.sent();
                        if (errors.length)
                            return [2 /*return*/, Promise.reject(errors)];
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs validation of the given object based on decorators or validation schema.
     */
    Validator.prototype.validateSync = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
        var object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions : objectOrSchemaName;
        var options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions;
        var schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName : undefined;
        var executor = new ValidationExecutor_1.ValidationExecutor(this, options);
        executor.ignoreAsyncValidations = true;
        var validationErrors = [];
        executor.execute(object, schema, validationErrors);
        return executor.stripEmptyErrors(validationErrors);
    };
    /**
     * Performs validation of the given object based on the given ValidationMetadata object.
     */
    Validator.prototype.validateValueByMetadata = function (value, metadata) {
        switch (metadata.type) {
            /* common checkers */
            case ValidationTypes_1.ValidationTypes.IS_DEFINED:
                return this.isDefined(value);
            case ValidationTypes_1.ValidationTypes.EQUALS:
                return this.equals(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.NOT_EQUALS:
                return this.notEquals(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_EMPTY:
                return this.isEmpty(value);
            case ValidationTypes_1.ValidationTypes.IS_NOT_EMPTY:
                return this.isNotEmpty(value);
            case ValidationTypes_1.ValidationTypes.IS_IN:
                return this.isIn(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_NOT_IN:
                return this.isNotIn(value, metadata.constraints[0]);
            /* type checkers */
            case ValidationTypes_1.ValidationTypes.IS_BOOLEAN:
                return this.isBoolean(value);
            case ValidationTypes_1.ValidationTypes.IS_DATE:
                return this.isDate(value);
            case ValidationTypes_1.ValidationTypes.IS_STRING:
                return this.isString(value);
            case ValidationTypes_1.ValidationTypes.IS_DATE_STRING:
                return this.isDateString(value);
            case ValidationTypes_1.ValidationTypes.IS_ARRAY:
                return this.isArray(value);
            case ValidationTypes_1.ValidationTypes.IS_NUMBER:
                return this.isNumber(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_INT:
                return this.isInt(value);
            case ValidationTypes_1.ValidationTypes.IS_ENUM:
                return this.isEnum(value, metadata.constraints[0]);
            /* number checkers */
            case ValidationTypes_1.ValidationTypes.IS_DIVISIBLE_BY:
                return this.isDivisibleBy(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_POSITIVE:
                return this.isPositive(value);
            case ValidationTypes_1.ValidationTypes.IS_NEGATIVE:
                return this.isNegative(value);
            case ValidationTypes_1.ValidationTypes.MIN:
                return this.min(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.MAX:
                return this.max(value, metadata.constraints[0]);
            /* date checkers */
            case ValidationTypes_1.ValidationTypes.MIN_DATE:
                return this.minDate(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.MAX_DATE:
                return this.maxDate(value, metadata.constraints[0]);
            /* string-as-type checkers */
            case ValidationTypes_1.ValidationTypes.IS_BOOLEAN_STRING:
                return this.isBooleanString(value);
            case ValidationTypes_1.ValidationTypes.IS_NUMBER_STRING:
                return this.isNumberString(value);
            /* string checkers */
            case ValidationTypes_1.ValidationTypes.CONTAINS:
                return this.contains(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.NOT_CONTAINS:
                return this.notContains(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_ALPHA:
                return this.isAlpha(value);
            case ValidationTypes_1.ValidationTypes.IS_ALPHANUMERIC:
                return this.isAlphanumeric(value);
            case ValidationTypes_1.ValidationTypes.IS_ASCII:
                return this.isAscii(value);
            case ValidationTypes_1.ValidationTypes.IS_BASE64:
                return this.isBase64(value);
            case ValidationTypes_1.ValidationTypes.IS_BYTE_LENGTH:
                return this.isByteLength(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes_1.ValidationTypes.IS_CREDIT_CARD:
                return this.isCreditCard(value);
            case ValidationTypes_1.ValidationTypes.IS_CURRENCY:
                return this.isCurrency(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_EMAIL:
                return this.isEmail(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_FQDN:
                return this.isFQDN(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_FULL_WIDTH:
                return this.isFullWidth(value);
            case ValidationTypes_1.ValidationTypes.IS_HALF_WIDTH:
                return this.isHalfWidth(value);
            case ValidationTypes_1.ValidationTypes.IS_VARIABLE_WIDTH:
                return this.isVariableWidth(value);
            case ValidationTypes_1.ValidationTypes.IS_HEX_COLOR:
                return this.isHexColor(value);
            case ValidationTypes_1.ValidationTypes.IS_HEXADECIMAL:
                return this.isHexadecimal(value);
            case ValidationTypes_1.ValidationTypes.IS_IP:
                return this.isIP(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_ISBN:
                return this.isISBN(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_ISIN:
                return this.isISIN(value);
            case ValidationTypes_1.ValidationTypes.IS_ISO8601:
                return this.isISO8601(value);
            case ValidationTypes_1.ValidationTypes.IS_JSON:
                return this.isJSON(value);
            case ValidationTypes_1.ValidationTypes.IS_LOWERCASE:
                return this.isLowercase(value);
            case ValidationTypes_1.ValidationTypes.IS_MOBILE_PHONE:
                return this.isMobilePhone(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_PHONE_NUMBER:
                return this.isPhoneNumber(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_MONGO_ID:
                return this.isMongoId(value);
            case ValidationTypes_1.ValidationTypes.IS_MULTIBYTE:
                return this.isMultibyte(value);
            case ValidationTypes_1.ValidationTypes.IS_SURROGATE_PAIR:
                return this.isSurrogatePair(value);
            case ValidationTypes_1.ValidationTypes.IS_URL:
                return this.isURL(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_UUID:
                return this.isUUID(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.IS_UPPERCASE:
                return this.isUppercase(value);
            case ValidationTypes_1.ValidationTypes.LENGTH:
                return this.length(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes_1.ValidationTypes.MIN_LENGTH:
                return this.minLength(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.MAX_LENGTH:
                return this.maxLength(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.MATCHES:
                return this.matches(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes_1.ValidationTypes.IS_MILITARY_TIME:
                return this.isMilitaryTime(value);
            /* array checkers */
            case ValidationTypes_1.ValidationTypes.ARRAY_CONTAINS:
                return this.arrayContains(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.ARRAY_NOT_CONTAINS:
                return this.arrayNotContains(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.ARRAY_NOT_EMPTY:
                return this.arrayNotEmpty(value);
            case ValidationTypes_1.ValidationTypes.ARRAY_MIN_SIZE:
                return this.arrayMinSize(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.ARRAY_MAX_SIZE:
                return this.arrayMaxSize(value, metadata.constraints[0]);
            case ValidationTypes_1.ValidationTypes.ARRAY_UNIQUE:
                return this.arrayUnique(value);
            case ValidationTypes_1.ValidationTypes.IS_INSTANCE:
                return this.isInstance(value, metadata.constraints[0]);
        }
        return true;
    };
    // -------------------------------------------------------------------------
    // Validation Methods: common checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if value is defined (!== undefined, !== null).
     */
    Validator.prototype.isDefined = function (value) {
        return value !== undefined && value !== null;
    };
    /**
     * Checks if value matches ("===") the comparison.
     */
    Validator.prototype.equals = function (value, comparison) {
        return value === comparison;
    };
    /**
     * Checks if value does not match ("!==") the comparison.
     */
    Validator.prototype.notEquals = function (value, comparison) {
        return value !== comparison;
    };
    /**
     * Checks if given value is empty (=== '', === null, === undefined).
     */
    Validator.prototype.isEmpty = function (value) {
        return value === "" || value === null || value === undefined;
    };
    /**
     * Checks if given value is not empty (!== '', !== null, !== undefined).
     */
    Validator.prototype.isNotEmpty = function (value) {
        return value !== "" && value !== null && value !== undefined;
    };
    /**
     * Checks if given value is in a array of allowed values.
     */
    Validator.prototype.isIn = function (value, possibleValues) {
        return !(possibleValues instanceof Array) || possibleValues.some(function (possibleValue) { return possibleValue === value; });
    };
    /**
     * Checks if given value not in a array of allowed values.
     */
    Validator.prototype.isNotIn = function (value, possibleValues) {
        return !(possibleValues instanceof Array) || !possibleValues.some(function (possibleValue) { return possibleValue === value; });
    };
    // -------------------------------------------------------------------------
    // Validation Methods: type checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if a given value is a real boolean.
     */
    Validator.prototype.isBoolean = function (value) {
        return value instanceof Boolean || typeof value === "boolean";
    };
    /**
     * Checks if a given value is a real date.
     */
    Validator.prototype.isDate = function (value) {
        return value instanceof Date && !isNaN(value.getTime());
    };
    /**
     * Checks if a given value is a real string.
     */
    Validator.prototype.isString = function (value) {
        return value instanceof String || typeof value === "string";
    };
    /**
     * Checks if a given value is a ISOString date.
     */
    Validator.prototype.isDateString = function (value) {
        var regex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|\+[0-2]\d(?:\:[0-5]\d)?)?$/g;
        return this.isString(value) && regex.test(value);
    };
    /**
     * Checks if a given value is an array
     */
    Validator.prototype.isArray = function (value) {
        return value instanceof Array;
    };
    /**
     * Checks if a given value is an enum
     */
    Validator.prototype.isEnum = function (value, entity) {
        var enumValues = Object.keys(entity)
            .map(function (k) { return entity[k]; });
        return enumValues.indexOf(value) >= 0;
    };
    /**
     * Checks if a given value is a number.
     */
    Validator.prototype.isNumber = function (value, options) {
        if (options === void 0) { options = {}; }
        if (value === Infinity || value === -Infinity) {
            return options.allowInfinity;
        }
        if (Number.isNaN(value)) {
            return options.allowNaN;
        }
        return Number.isFinite(value);
    };
    /**
     * Checks if value is an integer.
     */
    Validator.prototype.isInt = function (val) {
        return Number.isInteger(val);
    };
    // -------------------------------------------------------------------------
    // Validation Methods: number checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if value is a number that's divisible by another.
     */
    Validator.prototype.isDivisibleBy = function (value, num) {
        return typeof value === "number" &&
            typeof num === "number" &&
            this.validatorJs.isDivisibleBy(String(value), num);
    };
    /**
     * Checks if the value is a positive number.
     */
    Validator.prototype.isPositive = function (value) {
        return typeof value === "number" && value > 0;
    };
    /**
     * Checks if the value is a negative number.
     */
    Validator.prototype.isNegative = function (value) {
        return typeof value === "number" && value < 0;
    };
    /**
     * Checks if the first number is greater than or equal to the second.
     */
    Validator.prototype.min = function (num, min) {
        return typeof num === "number" && typeof min === "number" && num >= min;
    };
    /**
     * Checks if the first number is less than or equal to the second.
     */
    Validator.prototype.max = function (num, max) {
        return typeof num === "number" && typeof max === "number" && num <= max;
    };
    // -------------------------------------------------------------------------
    // Validation Methods: date checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if the value is a date that's after the specified date.
     */
    Validator.prototype.minDate = function (date, minDate) {
        return date && date.getTime() >= minDate.getTime();
    };
    /**
     * Checks if the value is a date that's before the specified date.
     */
    Validator.prototype.maxDate = function (date, maxDate) {
        return date && date.getTime() <= maxDate.getTime();
    };
    // -------------------------------------------------------------------------
    // Validation Methods: string-as-type checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if a string is a boolean.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isBooleanString = function (value) {
        return typeof value === "string" && this.validatorJs.isBoolean(value);
    };
    /**
     * Checks if the string is numeric.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isNumberString = function (value, options) {
        return typeof value === "string" && this.validatorJs.isNumeric(value, options);
    };
    // -------------------------------------------------------------------------
    // Validation Methods: string checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if the string contains the seed.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.contains = function (value, seed) {
        return typeof value === "string" && this.validatorJs.contains(value, seed);
    };
    /**
     * Checks if the string does not contain the seed.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.notContains = function (value, seed) {
        return typeof value === "string" && !this.validatorJs.contains(value, seed);
    };
    /**
     * Checks if the string contains only letters (a-zA-Z).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isAlpha = function (value) {
        return typeof value === "string" && this.validatorJs.isAlpha(value);
    };
    /**
     * Checks if the string contains only letters and numbers.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isAlphanumeric = function (value) {
        return typeof value === "string" && this.validatorJs.isAlphanumeric(value);
    };
    /**
     * Checks if the string contains ASCII chars only.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isAscii = function (value) {
        return typeof value === "string" && this.validatorJs.isAscii(value);
    };
    /**
     * Checks if a string is base64 encoded.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isBase64 = function (value) {
        return typeof value === "string" && this.validatorJs.isBase64(value);
    };
    /**
     * Checks if the string's length (in bytes) falls in a range.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isByteLength = function (value, min, max) {
        return typeof value === "string" && this.validatorJs.isByteLength(value, min, max);
    };
    /**
     * Checks if the string is a credit card.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isCreditCard = function (value) {
        return typeof value === "string" && this.validatorJs.isCreditCard(value);
    };
    /**
     * Checks if the string is a valid currency amount.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isCurrency = function (value, options) {
        return typeof value === "string" && this.validatorJs.isCurrency(value, options);
    };
    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isEmail = function (value, options) {
        return typeof value === "string" && this.validatorJs.isEmail(value, options);
    };
    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isFQDN = function (value, options) {
        return typeof value === "string" && this.validatorJs.isFQDN(value, options);
    };
    /**
     * Checks if the string contains any full-width chars.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isFullWidth = function (value) {
        return typeof value === "string" && this.validatorJs.isFullWidth(value);
    };
    /**
     * Checks if the string contains any half-width chars.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isHalfWidth = function (value) {
        return typeof value === "string" && this.validatorJs.isHalfWidth(value);
    };
    /**
     * Checks if the string contains variable-width chars.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isVariableWidth = function (value) {
        return typeof value === "string" && this.validatorJs.isVariableWidth(value);
    };
    /**
     * Checks if the string is a hexadecimal color.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isHexColor = function (value) {
        return typeof value === "string" && this.validatorJs.isHexColor(value);
    };
    /**
     * Checks if the string is a hexadecimal number.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isHexadecimal = function (value) {
        return typeof value === "string" && this.validatorJs.isHexadecimal(value);
    };
    /**
     * Checks if the string is an IP (version 4 or 6).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isIP = function (value, version) {
        return typeof value === "string" && this.validatorJs.isIP(value, version);
    };
    /**
     * Checks if the string is an ISBN (version 10 or 13).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isISBN = function (value, version) {
        return typeof value === "string" && this.validatorJs.isISBN(value, version);
    };
    /**
     * Checks if the string is an ISIN (stock/security identifier).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isISIN = function (value) {
        return typeof value === "string" && this.validatorJs.isISIN(value);
    };
    /**
     * Checks if the string is a valid ISO 8601 date.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isISO8601 = function (value) {
        return typeof value === "string" && this.validatorJs.isISO8601(value);
    };
    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isJSON = function (value) {
        return typeof value === "string" && this.validatorJs.isJSON(value);
    };
    /**
     * Checks if the string is lowercase.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isLowercase = function (value) {
        return typeof value === "string" && this.validatorJs.isLowercase(value);
    };
    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isMobilePhone = function (value, locale) {
        return typeof value === "string" && this.validatorJs.isMobilePhone(value, locale);
    };
    /**
     * Checks if the string is a valid phone number.
     * @param value the potential phone number string to test
     * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
     * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
     * See [google-libphonenumber, metadata.js:countryCodeToRegionCodeMap on github]{@link https://github.com/ruimarinho/google-libphonenumber/blob/1e46138878cff479aafe2ce62175c6c49cb58720/src/metadata.js#L33}
     */
    Validator.prototype.isPhoneNumber = function (value, region) {
        try {
            var phoneNum = this.libPhoneNumber.phoneUtil.parseAndKeepRawInput(value, region);
            return this.libPhoneNumber.phoneUtil.isValidNumber(phoneNum);
        }
        catch (error) {
            // logging?
            return false;
        }
    };
    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isMongoId = function (value) {
        return typeof value === "string" && this.validatorJs.isMongoId(value);
    };
    /**
     * Checks if the string contains one or more multibyte chars.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isMultibyte = function (value) {
        return typeof value === "string" && this.validatorJs.isMultibyte(value);
    };
    /**
     * Checks if the string contains any surrogate pairs chars.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isSurrogatePair = function (value) {
        return typeof value === "string" && this.validatorJs.isSurrogatePair(value);
    };
    /**
     * Checks if the string is an url.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isURL = function (value, options) {
        return typeof value === "string" && this.validatorJs.isURL(value, options);
    };
    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isUUID = function (value, version) {
        return typeof value === "string" && this.validatorJs.isUUID(value, version);
    };
    /**
     * Checks if the string is uppercase.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.isUppercase = function (value) {
        return typeof value === "string" && this.validatorJs.isUppercase(value);
    };
    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.length = function (value, min, max) {
        return typeof value === "string" && this.validatorJs.isLength(value, min, max);
    };
    /**
     * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.minLength = function (value, min) {
        return typeof value === "string" && this.length(value, min);
    };
    /**
     * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.maxLength = function (value, max) {
        return typeof value === "string" && this.length(value, 0, max);
    };
    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     * If given value is not a string, then it returns false.
     */
    Validator.prototype.matches = function (value, pattern, modifiers) {
        return typeof value === "string" && this.validatorJs.matches(value, pattern, modifiers);
    };
    /**
     * Checks if the string represents a time without a given timezone in the format HH:MM (military)
     * If the given value does not match the pattern HH:MM, then it returns false.
     */
    Validator.prototype.isMilitaryTime = function (value) {
        return this.matches(value, /^([01]\d|2[0-3]):?([0-5]\d)$/);
    };
    // -------------------------------------------------------------------------
    // Validation Methods: array checkers
    // -------------------------------------------------------------------------
    /**
     * Checks if array contains all values from the given array of values.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayContains = function (array, values) {
        if (!(array instanceof Array))
            return false;
        return !array || values.every(function (value) { return array.indexOf(value) !== -1; });
    };
    /**
     * Checks if array does not contain any of the given values.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayNotContains = function (array, values) {
        if (!(array instanceof Array))
            return false;
        return !array || values.every(function (value) { return array.indexOf(value) === -1; });
    };
    /**
     * Checks if given array is not empty.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayNotEmpty = function (array) {
        if (!(array instanceof Array))
            return false;
        return array instanceof Array && array.length > 0;
    };
    /**
     * Checks if array's length is as minimal this number.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayMinSize = function (array, min) {
        if (!(array instanceof Array))
            return false;
        return array instanceof Array && array.length >= min;
    };
    /**
     * Checks if array's length is as maximal this number.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayMaxSize = function (array, max) {
        if (!(array instanceof Array))
            return false;
        return array instanceof Array && array.length <= max;
    };
    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     * If null or undefined is given then this function returns false.
     */
    Validator.prototype.arrayUnique = function (array) {
        if (!(array instanceof Array))
            return false;
        var uniqueItems = array.filter(function (a, b, c) { return c.indexOf(a) === b; });
        return array.length === uniqueItems.length;
    };
    /**
     * Checks if the value is an instance of the specified object.
     */
    Validator.prototype.isInstance = function (object, targetTypeConstructor) {
        return targetTypeConstructor
            && typeof targetTypeConstructor === "function"
            && object instanceof targetTypeConstructor;
    };
    return Validator;
}());
exports.Validator = Validator;

//# sourceMappingURL=Validator.js.map
