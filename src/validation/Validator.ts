import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {ValidationTypes} from "./ValidationTypes";
import {ValidationError} from "./ValidationError";
import {IsNumberOptions} from "./ValidationTypeOptions";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationExecutor} from "./ValidationExecutor";
import {ValidationOptions} from "../decorator/ValidationOptions";
import * as validator from "validator";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private validatorJs = validator;
    private _isEmptyObject = function(object: object) {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Performs validation of the given object based on decorators or validation schema.
     * Common method for `validateOrReject` and `validate` methods.
     */
    private coreValidate(objectOrSchemaName: Object|string, objectOrValidationOptions: Object|ValidationOptions, maybeValidatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
        const object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions as Object : objectOrSchemaName as Object;
        const options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions as ValidationOptions;
        const schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName as string : undefined;

        const executor = new ValidationExecutor(this, options);
        const validationErrors: ValidationError[] = [];
        executor.execute(object, schema, validationErrors);

        return Promise.all(executor.awaitingPromises).then(() => {
            return executor.stripEmptyErrors(validationErrors);
        });
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs validation of the given object based on decorators used in given object class.
     */
    validate(object: Object, options?: ValidatorOptions): Promise<ValidationError[]>;

    /**
     * Performs validation of the given object based on validation schema.
     */
    validate(schemaName: string, object: Object, options?: ValidatorOptions): Promise<ValidationError[]>;

    /**
     * Performs validation of the given object based on decorators or validation schema.
     */
    validate(objectOrSchemaName: Object|string, objectOrValidationOptions: Object|ValidationOptions, maybeValidatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
        return this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
    }

    /**
     * Performs validation of the given object based on decorators used in given object class and reject on error.
     */
    validateOrReject(object: Object, options?: ValidatorOptions): Promise<void>;

    /**
     * Performs validation of the given object based on validation schema and reject on error.
     */
    validateOrReject(schemaName: string, object: Object, options?: ValidatorOptions): Promise<void>;

    /**
     * Performs validation of the given object based on decorators or validation schema and reject on error.
     */
    async validateOrReject(objectOrSchemaName: Object|string, objectOrValidationOptions: Object|ValidationOptions, maybeValidatorOptions?: ValidatorOptions): Promise<void> {
        const errors = await this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
        if (errors.length)
            return Promise.reject(errors);
    }

    /**
     * Performs validation of the given object based on decorators used in given object class.
     * NOTE: This method completely ignores all async validations.
     */
    validateSync(object: Object, options?: ValidatorOptions): ValidationError[];

    /**
     * Performs validation of the given object based on validation schema.
     */
    validateSync(schemaName: string, object: Object, options?: ValidatorOptions): ValidationError[];

    /**
     * Performs validation of the given object based on decorators or validation schema.
     */
    validateSync(objectOrSchemaName: Object|string, objectOrValidationOptions: Object|ValidationOptions, maybeValidatorOptions?: ValidatorOptions): ValidationError[] {
        const object = typeof objectOrSchemaName === "string" ? objectOrValidationOptions as Object : objectOrSchemaName as Object;
        const options = typeof objectOrSchemaName === "string" ? maybeValidatorOptions : objectOrValidationOptions as ValidationOptions;
        const schema = typeof objectOrSchemaName === "string" ? objectOrSchemaName as string : undefined;

        const executor = new ValidationExecutor(this, options);
        executor.ignoreAsyncValidations = true;
        const validationErrors: ValidationError[] = [];
        executor.execute(object, schema, validationErrors);
        return executor.stripEmptyErrors(validationErrors);
    }

    /**
     * Performs validation of the given object based on the given ValidationMetadata object.
     */
    validateValueByMetadata(value: any, metadata: ValidationMetadata): boolean {
        switch (metadata.type) {
            /* common checkers */
            case ValidationTypes.IS_DEFINED:
                return this.isDefined(value);
            case ValidationTypes.EQUALS:
                return this.equals(value, metadata.constraints[0]);
            case ValidationTypes.NOT_EQUALS:
                return this.notEquals(value, metadata.constraints[0]);
            case ValidationTypes.IS_EMPTY:
                return this.isEmpty(value);
            case ValidationTypes.IS_NOT_EMPTY:
                return this.isNotEmpty(value);
            case ValidationTypes.IS_IN:
                return this.isIn(value, metadata.constraints[0]);
            case ValidationTypes.IS_NOT_IN:
                return this.isNotIn(value, metadata.constraints[0]);

            /* type checkers */
            case ValidationTypes.IS_LATLONG:
                return this.isLatLong(value);
            case ValidationTypes.IS_LATITUDE:
                return this.isLatitude(value);
            case ValidationTypes.IS_LONGITUDE:
                return this.isLongitude(value);
            case ValidationTypes.IS_BOOLEAN:
                return this.isBoolean(value);
            case ValidationTypes.IS_DATE:
                return this.isDate(value);
            case ValidationTypes.IS_STRING:
                return this.isString(value);
            case ValidationTypes.IS_DATE_STRING:
                return this.isDateString(value);
            case ValidationTypes.IS_ARRAY:
                return this.isArray(value);
            case ValidationTypes.IS_NUMBER:
                return this.isNumber(value, metadata.constraints[0]);
            case ValidationTypes.IS_INT:
                return this.isInt(value);
            case ValidationTypes.IS_ENUM:
                return this.isEnum(value, metadata.constraints[0]);

            /* number checkers */
            case ValidationTypes.IS_DIVISIBLE_BY:
                return this.isDivisibleBy(value, metadata.constraints[0]);
            case ValidationTypes.IS_POSITIVE:
                return this.isPositive(value);
            case ValidationTypes.IS_NEGATIVE:
                return this.isNegative(value);
            case ValidationTypes.MIN:
                return this.min(value, metadata.constraints[0]);
            case ValidationTypes.MAX:
                return this.max(value, metadata.constraints[0]);

            /* date checkers */
            case ValidationTypes.MIN_DATE:
                return this.minDate(value, metadata.constraints[0]);
            case ValidationTypes.MAX_DATE:
                return this.maxDate(value, metadata.constraints[0]);

            /* string-as-type checkers */
            case ValidationTypes.IS_BOOLEAN_STRING:
                return this.isBooleanString(value);
            case ValidationTypes.IS_NUMBER_STRING:
                return this.isNumberString(value);

            /* string checkers */
            case ValidationTypes.CONTAINS:
                return this.contains(value, metadata.constraints[0]);
            case ValidationTypes.NOT_CONTAINS:
                return this.notContains(value, metadata.constraints[0]);
            case ValidationTypes.IS_ALPHA:
                return this.isAlpha(value, metadata.constraints[0]);
            case ValidationTypes.IS_ALPHANUMERIC:
                return this.isAlphanumeric(value, metadata.constraints[0]);
            case ValidationTypes.IS_DECIMAL:
                return this.isDecimal(value, metadata.constraints[0]);
            case ValidationTypes.IS_ASCII:
                return this.isAscii(value);
            case ValidationTypes.IS_BASE64:
                return this.isBase64(value);
            case ValidationTypes.IS_BYTE_LENGTH:
                return this.isByteLength(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes.IS_CREDIT_CARD:
                return this.isCreditCard(value);
            case ValidationTypes.IS_CURRENCY:
                return this.isCurrency(value, metadata.constraints[0]);
            case ValidationTypes.IS_EMAIL:
                return this.isEmail(value, metadata.constraints[0]);
            case ValidationTypes.IS_FQDN:
                return this.isFQDN(value, metadata.constraints[0]);
            case ValidationTypes.IS_FULL_WIDTH:
                return this.isFullWidth(value);
            case ValidationTypes.IS_HALF_WIDTH:
                return this.isHalfWidth(value);
            case ValidationTypes.IS_VARIABLE_WIDTH:
                return this.isVariableWidth(value);
            case ValidationTypes.IS_HEX_COLOR:
                return this.isHexColor(value);
            case ValidationTypes.IS_HEXADECIMAL:
                return this.isHexadecimal(value);
            case ValidationTypes.IS_IP:
                return this.isIP(value, metadata.constraints[0]);
            case ValidationTypes.IS_PORT:
                return this.isPort(value);
            case ValidationTypes.IS_ISBN:
                return this.isISBN(value, metadata.constraints[0]);
            case ValidationTypes.IS_ISIN:
                return this.isISIN(value);
            case ValidationTypes.IS_ISO8601:
                return this.isISO8601(value);
            case ValidationTypes.IS_JSON:
                return this.isJSON(value);
            case ValidationTypes.IS_OBJECT:
                return this.isObject(value);
            case ValidationTypes.IS_NOT_EMPTY_OBJECT:
                return this.isNotEmptyObject(value);
            case ValidationTypes.IS_LOWERCASE:
                return this.isLowercase(value);
            case ValidationTypes.IS_MOBILE_PHONE:
                return this.isMobilePhone(value, metadata.constraints[0]);
            case ValidationTypes.IS_ISO31661_ALPHA_2:
                return this.isISO31661Alpha2(value);
            case ValidationTypes.IS_ISO31661_ALPHA_3:
                return this.isISO31661Alpha3(value);
            case ValidationTypes.IS_MONGO_ID:
                return this.isMongoId(value);
            case ValidationTypes.IS_MULTIBYTE:
                return this.isMultibyte(value);
            case ValidationTypes.IS_SURROGATE_PAIR:
                return this.isSurrogatePair(value);
            case ValidationTypes.IS_URL:
                return this.isURL(value, metadata.constraints[0]);
            case ValidationTypes.IS_UUID:
                return this.isUUID(value, metadata.constraints[0]);
            case ValidationTypes.IS_UPPERCASE:
                return this.isUppercase(value);
            case ValidationTypes.LENGTH:
                return this.length(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes.MIN_LENGTH:
                return this.minLength(value, metadata.constraints[0]);
            case ValidationTypes.MAX_LENGTH:
                return this.maxLength(value, metadata.constraints[0]);
            case ValidationTypes.MATCHES:
                return this.matches(value, metadata.constraints[0], metadata.constraints[1]);
            case ValidationTypes.IS_MILITARY_TIME:
                return this.isMilitaryTime(value);

            /* array checkers */
            case ValidationTypes.ARRAY_CONTAINS:
                return this.arrayContains(value, metadata.constraints[0]);
            case ValidationTypes.ARRAY_NOT_CONTAINS:
                return this.arrayNotContains(value, metadata.constraints[0]);
            case ValidationTypes.ARRAY_NOT_EMPTY:
                return this.arrayNotEmpty(value);
            case ValidationTypes.ARRAY_MIN_SIZE:
                return this.arrayMinSize(value, metadata.constraints[0]);
            case ValidationTypes.ARRAY_MAX_SIZE:
                return this.arrayMaxSize(value, metadata.constraints[0]);
            case ValidationTypes.ARRAY_UNIQUE:
                return this.arrayUnique(value);

            case ValidationTypes.IS_INSTANCE:
                return this.isInstance(value, metadata.constraints[0]);
        }
        return true;
    }

    // -------------------------------------------------------------------------
    // Validation Methods: common checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if value is defined (!== undefined, !== null).
     */
    isDefined(value: unknown): boolean {
        return value !== undefined && value !== null;
    }

    /**
     * Checks if value matches ("===") the comparison.
     */
    equals(value: unknown, comparison: unknown): boolean {
        return value === comparison;
    }

    /**
     * Checks if value does not match ("!==") the comparison.
     */
    notEquals(value: unknown, comparison: unknown): boolean {
        return value !== comparison;
    }

    /**
     * Checks if given value is empty (=== '', === null, === undefined).
     */
    isEmpty(value: unknown): boolean {
        return value === "" || value === null || value === undefined;
    }

    /**
     * Checks if given value is not empty (!== '', !== null, !== undefined).
     */
    isNotEmpty(value: unknown): boolean {
        return value !== "" && value !== null && value !== undefined;
    }

    /**
     * Checks if given value is in a array of allowed values.
     */
    isIn(value: unknown, possibleValues: unknown[]): boolean {
        return !(possibleValues instanceof Array) || possibleValues.some(possibleValue => possibleValue === value);
    }

    /**
     * Checks if given value not in a array of allowed values.
     */
    isNotIn(value: unknown, possibleValues: unknown[]): boolean {
        return !(possibleValues instanceof Array) || !possibleValues.some(possibleValue => possibleValue === value);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: type checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if a given value is a real boolean.
     */
    isBoolean(value: unknown): boolean {
        return value instanceof Boolean || typeof value === "boolean";
    }


    /**
    * Checks if a given value is a latitude.
    */
    isLatLong(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isLatLong(value);
    }

    /**
    * Checks if a given value is a latitude.
    */
    isLatitude(value: unknown): boolean {
        return (typeof value === "number" || this.isString(value)) && this.isLatLong(`0,${value}`);
    }

    /**
    * Checks if a given value is a longitude.
    */
    isLongitude(value: unknown): boolean {
        return (typeof value === "number" || this.isString(value)) && this.isLatLong(`${value},0`);
    }

    /**
     * Checks if a given value is a real date.
     */
    isDate(value: unknown): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }

    /**
     * Checks if a given value is a real string.
     */
    isString(value: unknown): value is string {
        return value instanceof String || typeof value === "string";
    }

    /**
     * Checks if a given value is a ISOString date.
     */
    isDateString(value: unknown): boolean {
        const regex = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|\+[0-2]\d(?:\:[0-5]\d)?)?$/g;
        return this.isString(value) && regex.test(value);
    }

    /**
     * Checks if a given value is an array
     */
    isArray(value: unknown): boolean {
        return value instanceof Array;
    }

    /**
     * Checks if a given value is an enum
     */
    isEnum(value: unknown, entity: any): boolean {
        const enumValues = Object.keys(entity)
            .map(k => entity[k]);
        return enumValues.indexOf(value) >= 0;
    }

    /**
     * Checks if a given value is a number.
     */
    isNumber(value: unknown, options: IsNumberOptions = {}): boolean {
        if (typeof value !== "number") {
            return false;
        }

        if (value === Infinity || value === -Infinity) {
            return options.allowInfinity;
        }

        if (Number.isNaN(value)) {
            return options.allowNaN;
        }

        return Number.isFinite(value);
    }

    /**
     * Checks if value is an integer.
     */
    isInt(val: unknown): boolean {
        return typeof val === "number" && Number.isInteger(val);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: number checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if value is a number that's divisible by another.
     */
    isDivisibleBy(value: unknown, num: number): boolean {
        return  typeof value === "number" &&
            typeof num === "number" &&
            this.validatorJs.isDivisibleBy(String(value), num);
    }

    /**
     * Checks if the value is a positive number.
     */
    isPositive(value: unknown): boolean {
        return typeof value === "number" && value > 0;
    }

    /**
     * Checks if the value is a negative number.
     */
    isNegative(value: unknown): boolean {
        return typeof value === "number" && value < 0;
    }

    /**
     * Checks if the first number is greater than or equal to the second.
     */
    min(num: unknown, min: number): boolean {
        return typeof num === "number" && typeof min === "number" && num >= min;
    }

    /**
     * Checks if the first number is less than or equal to the second.
     */
    max(num: unknown, max: number): boolean {
        return typeof num === "number" && typeof max === "number" && num <= max;
    }

    // -------------------------------------------------------------------------
    // Validation Methods: date checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if the value is a date that's after the specified date.
     */
    minDate(date: unknown, minDate: Date): boolean {
        return date instanceof Date && date.getTime() >= minDate.getTime();
    }

    /**
     * Checks if the value is a date that's before the specified date.
     */
    maxDate(date: unknown, maxDate: Date): boolean {
        return date instanceof Date && date.getTime() <= maxDate.getTime();
    }

    // -------------------------------------------------------------------------
    // Validation Methods: string-as-type checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if a string is a boolean.
     * If given value is not a string, then it returns false.
     */
    isBooleanString(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isBoolean(value);
    }

    /**
     * Checks if the string is numeric.
     * If given value is not a string, then it returns false.
     */
    isNumberString(value: unknown, options?: ValidatorJS.IsNumericOptions): boolean {
        return typeof value === "string" && this.validatorJs.isNumeric(value, options);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: string checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if the string contains the seed.
     * If given value is not a string, then it returns false.
     */
    contains(value: unknown, seed: string): boolean {
        return typeof value === "string" && this.validatorJs.contains(value, seed);
    }

    /**
     * Checks if the string does not contain the seed.
     * If given value is not a string, then it returns false.
     */
    notContains(value: unknown, seed: string): boolean {
        return typeof value === "string" && !this.validatorJs.contains(value, seed);
    }

    /**
     * Checks if the string contains only letters (a-zA-Z).
     * If given value is not a string, then it returns false.
     */
    isAlpha(value: unknown, locale?: ValidatorJS.AlphaLocale): boolean {
        return typeof value === "string" && this.validatorJs.isAlpha(value, locale);
    }

    /**
     * Checks if the string contains only letters and numbers.
     * If given value is not a string, then it returns false.
     */
    isAlphanumeric(value: unknown, locale?: ValidatorJS.AlphanumericLocale): boolean {
        return typeof value === "string" && this.validatorJs.isAlphanumeric(value, locale);
    }

    /**
     * Checks if the string is a valid decimal.
     * If given value is not a string, then it returns false.
     */
    isDecimal(value: unknown, options?: ValidatorJS.IsDecimalOptions): boolean {
        return typeof value === "string" && this.validatorJs.isDecimal(value, options);
    }


    /**
     * Checks if the string contains ASCII chars only.
     * If given value is not a string, then it returns false.
     */
    isAscii(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isAscii(value);
    }

    /**
     * Checks if a string is base64 encoded.
     * If given value is not a string, then it returns false.
     */
    isBase64(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isBase64(value);
    }

    /**
     * Checks if the string's length (in bytes) falls in a range.
     * If given value is not a string, then it returns false.
     */
    isByteLength(value: unknown, min: number, max?: number): boolean {
        return typeof value === "string" && this.validatorJs.isByteLength(value, min, max);
    }

    /**
     * Checks if the string is a credit card.
     * If given value is not a string, then it returns false.
     */
    isCreditCard(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isCreditCard(value);
    }

    /**
     * Checks if the string is a valid currency amount.
     * If given value is not a string, then it returns false.
     */
    isCurrency(value: unknown, options?: ValidatorJS.IsCurrencyOptions): boolean {
        return typeof value === "string" && this.validatorJs.isCurrency(value, options);
    }

    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    isEmail(value: unknown, options?: ValidatorJS.IsEmailOptions): boolean {
        return typeof value === "string" && this.validatorJs.isEmail(value, options);
    }

    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     * If given value is not a string, then it returns false.
     */
    isFQDN(value: unknown, options?: ValidatorJS.IsFQDNOptions): boolean {
        return typeof value === "string" && this.validatorJs.isFQDN(value, options);
    }

    /**
     * Checks if the string contains any full-width chars.
     * If given value is not a string, then it returns false.
     */
    isFullWidth(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isFullWidth(value);
    }

    /**
     * Checks if the string contains any half-width chars.
     * If given value is not a string, then it returns false.
     */
    isHalfWidth(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isHalfWidth(value);
    }

    /**
     * Checks if the string contains variable-width chars.
     * If given value is not a string, then it returns false.
     */
    isVariableWidth(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isVariableWidth(value);
    }

    /**
     * Checks if the string is a hexadecimal color.
     * If given value is not a string, then it returns false.
     */
    isHexColor(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isHexColor(value);
    }

    /**
     * Checks if the string is a hexadecimal number.
     * If given value is not a string, then it returns false.
     */
    isHexadecimal(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isHexadecimal(value);
    }

    /**
     * Checks if the string is an IP (version 4 or 6).
     * If given value is not a string, then it returns false.
     */
    isIP(value: unknown, version?: number): boolean {
        return typeof value === "string" && this.validatorJs.isIP(value, version);
    }

    /**
     * Check if the string is a valid port number.
     */
    isPort(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isPort(value);
    }

    /**
     * Checks if the string is an ISBN (version 10 or 13).
     * If given value is not a string, then it returns false.
     */
    isISBN(value: unknown, version?: number): boolean {
        return typeof value === "string" && this.validatorJs.isISBN(value, version);
    }

    /**
     * Checks if the string is an ISIN (stock/security identifier).
     * If given value is not a string, then it returns false.
     */
    isISIN(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isISIN(value);
    }

    /**
     * Checks if the string is a valid ISO 8601 date.
     * If given value is not a string, then it returns false.
     */
    isISO8601(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isISO8601(value);
    }

    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     * If given value is not a string, then it returns false.
     */
    isJSON(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isJSON(value);
    }

    /**
     * Checks if the value is valid Object.
     * Returns false if the value is not an object.
     */
    isObject(value: unknown): value is object {
        return value != null && (typeof value === "object" || typeof value === "function") && !Array.isArray(value);
    }

    /**
     * Checks if the value is valid Object & not empty.
     * Returns false if the value is not an object or an empty valid object.
     */
    isNotEmptyObject(value: unknown): boolean {
        return this.isObject(value) && !this._isEmptyObject(value);
    }

    /**
     * Checks if the string is lowercase.
     * If given value is not a string, then it returns false.
     */
    isLowercase(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isLowercase(value);
    }

    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     * If given value is not a string, then it returns false.
     */
    isMobilePhone(value: unknown, locale: ValidatorJS.MobilePhoneLocale): boolean {
        return typeof value === "string" && this.validatorJs.isMobilePhone(value, locale);
    }

    /**
     * Check if the string is a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned country code.
     */
    isISO31661Alpha2(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isISO31661Alpha2(value);
    }

    /**
     * Check if the string is a valid [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) officially assigned country code.
     */
    isISO31661Alpha3(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isISO31661Alpha3(value);
    }

    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     * If given value is not a string, then it returns false.
     */
    isMongoId(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isMongoId(value);
    }

    /**
     * Checks if the string contains one or more multibyte chars.
     * If given value is not a string, then it returns false.
     */
    isMultibyte(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isMultibyte(value);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     * If given value is not a string, then it returns false.
     */
    isSurrogatePair(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isSurrogatePair(value);
    }

    /**
     * Checks if the string is an url.
     * If given value is not a string, then it returns false.
     */
    isURL(value: unknown, options?: ValidatorJS.IsURLOptions): boolean {
        return typeof value === "string" && this.validatorJs.isURL(value, options);
    }

    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     * If given value is not a string, then it returns false.
     */
    isUUID(value: unknown, version?: "3"|"4"|"5"): boolean {
        return typeof value === "string" && this.validatorJs.isUUID(value, version);
    }

    /**
     * Checks if the string is uppercase.
     * If given value is not a string, then it returns false.
     */
    isUppercase(value: unknown): boolean {
        return typeof value === "string" && this.validatorJs.isUppercase(value);
    }

    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    length(value: unknown, min: number, max?: number): boolean {
        return typeof value === "string" && this.validatorJs.isLength(value, min, max);
    }

    /**
     * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    minLength(value: unknown, min: number) {
        return typeof value === "string" && this.length(value, min);
    }

    /**
     * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    maxLength(value: unknown, max: number) {
        return typeof value === "string" && this.length(value, 0, max);
    }

    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     * If given value is not a string, then it returns false.
     */
    matches(value: unknown, pattern: RegExp, modifiers?: string): boolean {
        return typeof value === "string" && this.validatorJs.matches(value, pattern, modifiers);
    }

    /**
     * Checks if the string represents a time without a given timezone in the format HH:MM (military)
     * If the given value does not match the pattern HH:MM, then it returns false.
     */
    isMilitaryTime(value: unknown): boolean {
        return this.matches(value, /^([01]\d|2[0-3]):?([0-5]\d)$/);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: array checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if array contains all values from the given array of values.
     * If null or undefined is given then this function returns false.
     */
    arrayContains(array: unknown, values: any[]) {
        if (!(array instanceof Array))
            return false;

        return values.every(value => array.indexOf(value) !== -1);
    }

    /**
     * Checks if array does not contain any of the given values.
     * If null or undefined is given then this function returns false.
     */
    arrayNotContains(array: unknown, values: any[]) {
        if (!(array instanceof Array))
            return false;

        return values.every(value => array.indexOf(value) === -1);
    }

    /**
     * Checks if given array is not empty.
     * If null or undefined is given then this function returns false.
     */
    arrayNotEmpty(array: unknown) {
        return array instanceof Array && array.length > 0;
    }

    /**
     * Checks if array's length is as minimal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMinSize(array: unknown, min: number) {
        return array instanceof Array && array.length >= min;
    }

    /**
     * Checks if array's length is as maximal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMaxSize(array: unknown, max: number) {
        return array instanceof Array && array.length <= max;
    }

    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     * If null or undefined is given then this function returns false.
     */
    arrayUnique(array: unknown) {
        if (!(array instanceof Array))
            return false;

        const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
        return array.length === uniqueItems.length;
    }

    /**
     * Checks if the value is an instance of the specified object.
     */
    isInstance(object: unknown, targetTypeConstructor: new (...args: any[]) => any) {
        return targetTypeConstructor
            && typeof targetTypeConstructor === "function"
            && object instanceof targetTypeConstructor;
    }

}
