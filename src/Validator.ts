import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {ValidationTypes} from "./ValidationTypes";
import {defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ValidationErrorInterface} from "./ValidationErrorInterface";
import {ValidationTypesUtils} from "./ValidationTypes";
import {ValidationError} from "./ValidationError";
import {ValidatorOptions, IsEmailOptions, IsFQDNOptions, IsFloatOptions, IsURLOptions, IsIntOptions, IsCurrencyOptions} from "./ValidatorOptions";
import {ValidatorInterface} from "./ValidatorInterface";
import * as validatatorJs from "validator";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _container: { get(type: Function): any };
    private metadataStorage = defaultMetadataStorage;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    set container(container: { get(type: Function): any }) {
        this._container = container;
    }

    // -------------------------------------------------------------------------
    // Annotation-based Validation Methods
    // -------------------------------------------------------------------------

    /**
     * Performs validation of the given object based on annotations used in given object class.
     */
    validate(object: any, validatorOptions?: ValidatorOptions): ValidationErrorInterface[] {
        const groups = validatorOptions ? validatorOptions.groups : undefined;
        const metadatas = this.metadataStorage.getValidationMetadatasForObject(object.constructor, groups);
        return metadatas.map(metadata => {
            const value = object[metadata.propertyName];
            if (!value && validatorOptions && validatorOptions.skipMissingProperties === true)
                return null;

            const duplicateMetadatas = metadatas.filter(m => m.propertyName === metadata.propertyName && m.type === metadata.type);
            let errors = duplicateMetadatas.map(metadata => {
                let isValid = true;
                if (metadata.each) {
                    if (value instanceof Array)
                        isValid = value.every((v: any) => this.performValidation(v, metadata));

                } else {
                    isValid = this.performValidation(value, metadata);
                }
                if (isValid) return null;

                return <ValidationErrorInterface> {
                    property: metadata.propertyName,
                    errorCode: metadata.type,
                    errorName: ValidationTypesUtils.getCodeName(metadata.type),
                    errorMessage: metadata.message,
                    value: value,
                    required: metadata.value1
                };
            });

            const nestedValidation = duplicateMetadatas.reduce((found, metadata) => {
                return metadata.type === ValidationTypes.NESTED_VALIDATION ? metadata : found;
            }, undefined);
            if (nestedValidation) {
                if (value instanceof Array) {
                    value.map((v: any) => {
                        const nestedErrors = this.validate(v, validatorOptions);
                        if (nestedErrors && nestedErrors.length)
                            errors = errors.concat(nestedErrors);
                    });

                } else if (value instanceof Object) {
                    const nestedErrors = this.validate(value, validatorOptions);
                    if (nestedErrors && nestedErrors.length)
                        errors = errors.concat(nestedErrors);

                } else {
                    throw new Error("Only objects and arrays are supported to nested validation");
                }
            }

            return errors.reduceRight((found, err) => err !== null ? err : found, null);

        }).filter(error => error !== null);
    }

    /**
     * Performs validation of the given object based on annotations used in given object class.
     * Performs in async-style, useful to use it in chained promises.
     */
    validateAsync<T>(object: T, validatorOptions?: ValidatorOptions): Promise<T> {
        return new Promise<T>((ok, fail) => {
            const errors = this.validate(object, validatorOptions);
            if (errors.length > 0) {
                fail(new ValidationError(errors));
            } else {
                ok(object);
            }
        });
    }

    /**
     * Performs validation of the given object based on annotations used in given object class.
     * If validation is not passed then throws ValidationError.
     */
    validateOrThrow(object: any, validatorOptions?: ValidatorOptions): void {
        const errors = this.validate(object, validatorOptions);
        if (errors.length > 0)
            throw new ValidationError(errors);
    }

    /**
     * Checks if given object is valid (all annotations passes validation). Returns true if its valid, false otherwise.
     */
    isValid(object: any, validatorOptions?: ValidatorOptions): boolean {
        return this.validate(object, validatorOptions).length === 0;
    }

    // -------------------------------------------------------------------------
    // Validation Methods
    // -------------------------------------------------------------------------

    /**
     * Checks if the string contains the seed.
     */
    contains(str: string, seed: string): boolean {
        return validatatorJs.contains(str, seed);
    }

    /**
     * Checks if the string matches the comparison.
     */
    equals(str: string, comparison: string): boolean {
        return validatatorJs.equals(str, comparison);
    }

    /**
     * Checks if the string is a date that's after the specified date.
     */
    isAfter(date: string, afterDate: Date): boolean;
    isAfter(date: Date, afterDate: string): boolean;
    isAfter(date: string, afterDate: string): boolean;
    isAfter(date: Date, afterDate: Date): boolean;
    isAfter(date: Date|string, afterDate: Date|string): boolean {
        const dateString = date instanceof Date ? date.toDateString() : date;
        const afterDateString = afterDate instanceof Date ? afterDate.toDateString() : afterDate;
        return validatatorJs.isAfter(dateString, <any> afterDateString);
    }

    /**
     * Checks if the string contains only letters (a-zA-Z).
     */
    isAlpha(str: string): boolean {
        return validatatorJs.isAlpha(str);
    }

    /**
     * Checks if the string contains only letters and numbers.
     */
    isAlphanumeric(str: string): boolean {
        return validatatorJs.isAlphanumeric(str);
    }

    /**
     * Checks if the string contains ASCII chars only.
     */
    isAscii(str: string): boolean {
        return validatatorJs.isAscii(str);
    }

    /**
     * Checks if a string is base64 encoded.
     */
    isBase64(str: string): boolean {
        return validatatorJs.isBase64(str);
    }

    /**
     * Checks if the string is a date that's before the specified date.
     */
    isBefore(date: string, beforeDate: Date): boolean;
    isBefore(date: Date, beforeDate: string): boolean;
    isBefore(date: string, beforeDate: string): boolean;
    isBefore(date: Date, beforeDate: Date): boolean;
    isBefore(date: Date|string, beforeDate: Date|string): boolean {
        const dateString = date instanceof Date ? date.toDateString() : date;
        const beforeDateString = beforeDate instanceof Date ? beforeDate.toDateString() : beforeDate;
        return validatatorJs.isBefore(dateString, <any> beforeDateString);
    }

    /**
     * Checks if a string is a boolean.
     */
    isBooleanString(str: any): boolean {
        return validatatorJs.isBoolean(str);
    }

    /**
     * Checks if a boolean is a real boolean;
     */
    isBoolean(value: any): boolean {
        return value instanceof Boolean || typeof value === "boolean";
    }

    /**
     * Checks if the string's length (in bytes) falls in a range.
     */
    isByteLength(str: string, min: number, max?: number): boolean {
        return validatatorJs.isByteLength(str, min, max);
    }

    /**
     * Checks if the string is a credit card.
     */
    isCreditCard(str: string): boolean {
        return validatatorJs.isCreditCard(str);
    }

    /**
     * Checks if the string is a valid currency amount.
     */
    isCurrency(str: string, options?: IsCurrencyOptions): boolean {
        return validatatorJs.isCurrency(str, options);
    }

    /**
     * Checks if the string is a date.
     */
    isDate(str: string): boolean {
        return validatatorJs.isDate(str);
    }

    /**
     * Checks if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
     */
    isDecimal(str: string): boolean {
        return validatatorJs.isDecimal(str);
    }

    /**
     * Checks if the string is a number that's divisible by another.
     */
    isDivisibleBy(str: string, num: number): boolean {
        return validatatorJs.isDivisibleBy(str, num);
    }

    /**
     * Checks if the string is an email.
     */
    isEmail(str: string, options?: IsEmailOptions): boolean {
        return validatatorJs.isEmail(str, options);
    }

    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     */
    isFQDN(str: string, options?: IsFQDNOptions): boolean {
        return validatatorJs.isFQDN(str, options);
    }

    /**
     * Checks if the string is a float.
     */
    isFloat(val: number, options?: IsFloatOptions): boolean;
    isFloat(val: string, options?: IsFloatOptions): boolean;
    isFloat(val: string|number, options?: IsFloatOptions): boolean {
        const numberString = String(val);
        return validatatorJs.isFloat(numberString, options);
    }

    /**
     * Checks if the string contains any full-width chars.
     */
    isFullWidth(str: string): boolean {
        return validatatorJs.isFullWidth(str);
    }

    /**
     * Checks if the string contains any half-width chars.
     */
    isHalfWidth(str: string): boolean {
        return validatatorJs.isHalfWidth(str);
    }

    /**
     * Checks if the string contains variable-width chars.
     */
    isVariableWidth(str: string): boolean {
        return validatatorJs.isVariableWidth(str);
    }

    /**
     * Checks if the string is a hexadecimal color.
     */
    isHexColor(str: string): boolean {
        return validatatorJs.isHexColor(str);
    }

    /**
     * Checks if the string is a hexadecimal number.
     */
    isHexadecimal(str: string): boolean {
        return validatatorJs.isHexadecimal(str);
    }

    /**
     * Checks if the string is an IP (version 4 or 6).
     */
    isIP(str: string, version?: number): boolean {
        return validatatorJs.isIP(str, version);
    }

    /**
     * Checks if the string is an ISBN (version 10 or 13).
     */
    isISBN(str: string, version?: number): boolean {
        return validatatorJs.isISBN(str, version);
    }

    /**
     * Checks if the string is an ISIN (stock/security identifier).
     */
    isISIN(str: string): boolean {
        return validatatorJs.isISIN(str);
    }

    /**
     * Checks if the string is a valid ISO 8601 date.
     */
    isISO8601(str: string): boolean {
        return validatatorJs.isISO8601(str);
    }

    /**
     * Checks if the string is in a array of allowed values.
     */
    isIn(str: string, values: any[]): boolean {
        return validatatorJs.isIn(str, values);
    }

    /**
     * Checks if the string is an integer.
     */
    isInt(val: number, options?: IsIntOptions): boolean;
    isInt(val: string, options?: IsIntOptions): boolean;
    isInt(val: string|number, options?: IsIntOptions): boolean {
        const numberString = String(val);
        return validatatorJs.isInt(numberString, options);
    }

    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     */
    isJSON(str: string): boolean {
        return validatatorJs.isJSON(str);
    }

    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     */
    isLength(str: string, min: number, max?: number): boolean {
        return typeof str === "string" && validatatorJs.isLength(str, min, max);
    }

    /**
     * Checks if the string is lowercase.
     */
    isLowercase(str: string): boolean {
        return validatatorJs.isLowercase(str);
    }

    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     */
    isMobilePhone(str: string, locale: string): boolean {
        return validatatorJs.isMobilePhone(str, locale);
    }

    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     */
    isMongoId(str: string): boolean {
        return validatatorJs.isMongoId(str);
    }

    /**
     * Checks if the string contains one or more multibyte chars.
     */
    isMultibyte(str: string): boolean {
        return validatatorJs.isMultibyte(str);
    }

    /**
     * Checks if value is null.
     * @deprecated
     */
    isNull(value: any): boolean {
        return value === null;
    }

    /**
     * Checks if the string is numeric.
     */
    isNumeric(str: string): boolean {
        return validatatorJs.isNumeric(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isSurrogatePair(str: string): boolean {
        return validatatorJs.isSurrogatePair(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isURL(str: string, options?: IsURLOptions): boolean {
        return validatatorJs.isURL(str, options);
    }

    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     */
    isUUID(str: string, version?: number): boolean {
        return validatatorJs.isUUID(str, version);
    }

    /**
     * Checks if the string is uppercase.
     */
    isUppercase(str: string): boolean {
        return validatatorJs.isUppercase(str);
    }

    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     */
    matches(str: string, pattern: RegExp, modifiers?: string): boolean {
        return validatatorJs.matches(str, pattern, modifiers);
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private performValidation(value: any, metadata: ValidationMetadata): boolean {
        switch (metadata.type) {
            case ValidationTypes.CONTAINS:
                return this.contains(value, metadata.value1);
            case ValidationTypes.EQUALS:
                return this.equals(value, metadata.value1);
            case ValidationTypes.IS_AFTER:
                return this.isAfter(value, metadata.value1);
            case ValidationTypes.IS_ALPHA:
                return this.isAlpha(value);
            case ValidationTypes.IS_ALPHANUMERIC:
                return this.isAlphanumeric(value);
            case ValidationTypes.IS_ASCII:
                return this.isAscii(value);
            case ValidationTypes.IS_BASE64:
                return this.isBase64(value);
            case ValidationTypes.IS_BEFORE:
                return this.isBefore(value, metadata.value1);
            case ValidationTypes.IS_BOOLEAN_STRING:
                return this.isBooleanString(value);
            case ValidationTypes.IS_BOOLEAN:
                return this.isBoolean(value);
            case ValidationTypes.IS_BYTE_LENGTH:
                return this.isByteLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_CREDIT_CARD:
                return this.isCreditCard(value);
            case ValidationTypes.IS_CURRENCY:
                return this.isCurrency(value, metadata.value1);
            case ValidationTypes.IS_DATE:
                return this.isDate(value);
            case ValidationTypes.IS_DECIMAL:
                return this.isDecimal(value);
            case ValidationTypes.IS_DIVISIBLE_BY:
                return this.isDivisibleBy(value, metadata.value1);
            case ValidationTypes.IS_EMAIL:
                return this.isEmail(value, metadata.value1);
            case ValidationTypes.IS_FQDN:
                return this.isFQDN(value, metadata.value1);
            case ValidationTypes.IS_FLOAT:
                return this.isFloat(value, metadata.value1);
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
                return this.isIP(value, metadata.value1);
            case ValidationTypes.IS_ISBN:
                return this.isISBN(value, metadata.value1);
            case ValidationTypes.IS_ISIN:
                return this.isISIN(value);
            case ValidationTypes.IS_ISO8601:
                return this.isISO8601(value);
            case ValidationTypes.IS_IN:
                return this.isIn(value, metadata.value1);
            case ValidationTypes.IS_INT:
                return this.isInt(value, metadata.value1);
            case ValidationTypes.IS_JSON:
                return this.isJSON(value);
            case ValidationTypes.IS_LENGTH:
                return this.isLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_LOWERCASE:
                return this.isLowercase(value);
            case ValidationTypes.IS_MOBILE_PHONE:
                return this.isMobilePhone(value, metadata.value1);
            case ValidationTypes.IS_MONGO_ID:
                return this.isMongoId(value);
            case ValidationTypes.IS_MULTIBYTE:
                return this.isMultibyte(value);
            case ValidationTypes.IS_NULL:
                return this.isNull(value);
            case ValidationTypes.IS_NUMERIC:
                return this.isNumeric(value);
            case ValidationTypes.IS_SURROGATE_PAIR:
                return this.isSurrogatePair(value);
            case ValidationTypes.IS_URL:
                return this.isURL(value, metadata.value1);
            case ValidationTypes.IS_UUID:
                return this.isUUID(value, metadata.value1);
            case ValidationTypes.IS_UPPERCASE:
                return this.isUppercase(value);
            case ValidationTypes.MATCHES:
                return this.matches(value, metadata.value1, metadata.value2);

            // custom validation types
            case ValidationTypes.MIN_LENGTH:
                return this.isLength(value, metadata.value1);
            case ValidationTypes.MAX_LENGTH:
                return this.isLength(value, 0, metadata.value1);
            case ValidationTypes.MIN_NUMBER:
                return this.isInt(value, { min: metadata.value1 });
            case ValidationTypes.MAX_NUMBER:
                return this.isInt(value, { max: metadata.value1 });
            case ValidationTypes.NOT_EMPTY:
                return !!value;

            case ValidationTypes.NOT_EMPTY_ARRAY:
                return value instanceof Array && value.length > 0;
            case ValidationTypes.MIN_SIZE:
                if (value instanceof Array)
                    return value.length >= metadata.value1;
                break;
            case ValidationTypes.MAX_SIZE:
                if (value instanceof Array)
                    return value.length <= metadata.value1;
                break;
            case ValidationTypes.CUSTOM_VALIDATION:
                return this.metadataStorage
                    .getValidatorConstraintsForObject(metadata.value1)
                    .map(validatorMetadata => {
                        if (!validatorMetadata.instance)
                            validatorMetadata.instance = this.createInstance(validatorMetadata.object);

                        return validatorMetadata.instance;
                    }).every(validator => validator.validate(value));
        }
        return true;
    }

    private createInstance(object: Function): ValidatorInterface {
        return this._container ? this._container.get(object) : new (<any> object)();
    }

}
