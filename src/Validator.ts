import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {SanitizeTypes} from "./types/SanitizeTypes";
import {ValidationTypes} from "./types/ValidationTypes";
import {MetadataStorage, defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ValidationErrorInterface} from "./ValidationErrorInterface";
import {ValidationTypesUtils} from "./types/ValidationTypes";
import {ValidationError} from "./ValidationError";
import {ValidationOptions, IsEmailOptions, IsFQDNOptions, IsFloatOptions, IsURLOptions, IsIntOptions, IsCurrencyOptions} from "./ValidationOptions";
import {ValidatorInterface} from "./ValidatorInterface";
import {SanitizerInterface} from "./SanitizerInterface";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _container: { get(type: Function): any };
    private metadataStorage = defaultMetadataStorage;
    private validator = require("validator");

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
    validate(object: any, validationOptions?: ValidationOptions): ValidationErrorInterface[] {
        const groups = validationOptions ? validationOptions.groups : undefined;
        const metadatas = this.metadataStorage.getValidationMetadatasForObject(object.constructor, groups);
        return metadatas.map(metadata => {
            const value = object[metadata.propertyName];
            if (!value && validationOptions && validationOptions.skipMissingProperties === true)
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
                        const nestedErrors = this.validate(v, validationOptions);
                        if (nestedErrors && nestedErrors.length)
                            errors = errors.concat(nestedErrors);
                    });

                } else if (value instanceof Object) {
                    const nestedErrors = this.validate(value, validationOptions);
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
    validateAsync<T>(object: T, validationOptions?: ValidationOptions): Promise<T> {
        return new Promise<T>((ok, fail) => {
            const errors = this.validate(object, validationOptions);
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
    validateOrThrow(object: any, validationOptions?: ValidationOptions) {
        const errors = this.validate(object, validationOptions);
        if (errors.length > 0)
            throw new ValidationError(errors);
    }

    /**
     * Performs sanitization of the given object based on annotations used in given object class.
     */
    sanitize(object: any): void {
        this.metadataStorage
            .getSanitizeMetadatasForObject(object.constructor)
            .filter(metadata => !!object[metadata.propertyName])
            .forEach(metadata => object[metadata.propertyName] = this.sanitizeValue(object[metadata.propertyName], metadata));
    }

    /**
     * Performs sanitization of the given object based on annotations used in given object class.
     * Performs in async-style, useful to use it in chained promises.
     */
    sanitizeAsync<T>(object: T): Promise<T> {
        return new Promise<T>((ok) => {
            this.sanitize(object);
            ok(object);
        });
    }

    /**
     * Performs sanitization and validation of the given object based on annotations used in given object class.
     */
    sanitizeAndValidate(object: any, validationOptions?: ValidationOptions): ValidationErrorInterface[] {
        this.sanitize(object);
        return this.validate(object, validationOptions);
    }

    /**
     * Performs sanitization and validation of the given object based on annotations used in given object class.
     * Performs in async-style, useful to use it in chained promises.
     */
    sanitizeAndValidateAsync<T>(object: T, validationOptions?: ValidationOptions): Promise<T> {
        return new Promise<T>((ok, fail) => {
            const errors = this.sanitizeAndValidate(object, validationOptions);
            if (errors.length > 0) {
                fail(new ValidationError(errors));
            } else {
                ok(object);
            }
        });
    }

    /**
     * Checks if given object is valid (all annotations passes validation). Returns true if its valid, false otherwise.
     */
    isValid(object: any, validationOptions?: ValidationOptions): boolean {
        return this.validate(object, validationOptions).length === 0;
    }

    // -------------------------------------------------------------------------
    // Validation Methods
    // -------------------------------------------------------------------------

    /**
     * Checks if the string contains the seed.
     */
    contains(str: string, seed: string): boolean {
        return this.validator.contains(str, seed);
    }

    /**
     * Checks if the string matches the comparison.
     */
    equals(str: string, comparison: string): boolean {
        return this.validator.equals(str, comparison);
    }

    /**
     * Checks if the string is a date that's after the specified date.
     */
    isAfter(date: Date, afterDate: Date): boolean {
        return this.validator.isAfter(date, afterDate);
    }

    /**
     * Checks if the string contains only letters (a-zA-Z).
     */
    isAlpha(str: string): boolean {
        return this.validator.isAlpha(str);
    }

    /**
     * Checks if the string contains only letters and numbers.
     */
    isAlphanumeric(str: string): boolean {
        return this.validator.isAlphanumeric(str);
    }

    /**
     * Checks if the string contains ASCII chars only.
     */
    isAscii(str: string): boolean {
        return this.validator.isAscii(str);
    }

    /**
     * Checks if a string is base64 encoded.
     */
    isBase64(str: string): boolean {
        return this.validator.isBase64(str);
    }

    /**
     * Checks if the string is a date that's before the specified date.
     */
    isBefore(date: Date, beforeDate: Date): boolean {
        return this.validator.isBefore(date, beforeDate);
    }

    /**
     * Checks if a string is a boolean.
     */
    isBoolean(str: string): boolean {
        return this.validator.isBoolean(str);
    }

    /**
     * Checks if the string's length (in bytes) falls in a range.
     */
    isByteLength(str: string, min: number, max?: number): boolean {
        return this.validator.isByteLength(str, min, max);
    }

    /**
     * Checks if the string is a credit card.
     */
    isCreditCard(str: string): boolean {
        return this.validator.isCreditCard(str);
    }

    /**
     * Checks if the string is a valid currency amount.
     */
    isCurrency(str: string, options?: IsCurrencyOptions): boolean {
        return this.validator.isCurrency(str, options);
    }

    /**
     * Checks if the string is a date.
     */
    isDate(str: string): boolean {
        return this.validator.isDate(str);
    }

    /**
     * Checks if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
     */
    isDecimal(str: string): boolean {
        return this.validator.isDecimal(str);
    }

    /**
     * Checks if the string is a number that's divisible by another.
     */
    isDivisibleBy(str: string, num: number): boolean {
        return this.validator.isDivisibleBy(str, num);
    }

    /**
     * Checks if the string is an email.
     */
    isEmail(str: string, options: IsEmailOptions): boolean {
        return this.validator.isEmail(str, options);
    }

    /**
     * Checks if the string is a fully qualified domain name (e.g. domain.com).
     */
    isFQDN(str: string, options: IsFQDNOptions): boolean {
        return this.validator.isFQDN(str, options);
    }

    /**
     * Checks if the string is a float.
     */
    isFloat(str: string, options: IsFloatOptions): boolean {
        return this.validator.isFloat(str, options);
    }

    /**
     * Checks if the string contains any full-width chars.
     */
    isFullWidth(str: string): boolean {
        return this.validator.isFullWidth(str);
    }

    /**
     * Checks if the string contains any half-width chars.
     */
    isHalfWidth(str: string): boolean {
        return this.validator.isHalfWidth(str);
    }

    /**
     * Checks if the string contains variable-width chars.
     */
    isVariableWidth(str: string): boolean {
        return this.validator.isVariableWidth(str);
    }

    /**
     * Checks if the string is a hexadecimal color.
     */
    isHexColor(str: string): boolean {
        return this.validator.isHexColor(str);
    }

    /**
     * Checks if the string is a hexadecimal number.
     */
    isHexadecimal(str: string): boolean {
        return this.validator.isHexadecimal(str);
    }

    /**
     * Checks if the string is an IP (version 4 or 6).
     */
    isIP(str: string, version?: number): boolean {
        return this.validator.isIP(str, version);
    }

    /**
     * Checks if the string is an ISBN (version 10 or 13).
     */
    isISBN(str: string, version?: number): boolean {
        return this.validator.isISBN(str, version);
    }

    /**
     * Checks if the string is an ISIN (stock/security identifier).
     */
    isISIN(str: string): boolean {
        return this.validator.isISIN(str);
    }

    /**
     * Checks if the string is a valid ISO 8601 date.
     */
    isISO8601(str: string): boolean {
        return this.validator.isISO8601(str);
    }

    /**
     * Checks if the string is in a array of allowed values.
     */
    isIn(str: string, values: any[]): boolean {
        return this.validator.isIn(str, values);
    }

    /**
     * Checks if the string is an integer.
     */
    isInt(str: string, options: IsIntOptions): boolean {
        return this.validator.isInt(str, options);
    }

    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     */
    isJSON(str: string): boolean {
        return this.validator.isJSON(str);
    }

    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     */
    isLength(str: string, min: number, max?: number): boolean {
        return this.validator.isLength(str, min, max);
    }

    /**
     * Checks if the string is lowercase.
     */
    isLowercase(str: string): boolean {
        return this.validator.isLowercase(str);
    }

    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     */
    isMobilePhone(str: string, locale: string): boolean {
        return this.validator.isMobilePhone(str, locale);
    }

    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     */
    isMongoId(str: string): boolean {
        return this.validator.isMongoId(str);
    }

    /**
     * Checks if the string contains one or more multibyte chars.
     */
    isMultibyte(str: string): boolean {
        return this.validator.isMultibyte(str);
    }

    /**
     * Checks if the string is null.
     */
    isNull(input: any): boolean {
        return this.validator.isNull(input);
    }

    /**
     * Checks if the string is numeric.
     */
    isNumeric(str: string): boolean {
        return this.validator.isNumeric(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isSurrogatePair(str: string): boolean {
        return this.validator.isSurrogatePair(str);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     */
    isURL(str: string, options: IsURLOptions): boolean {
        return this.validator.isURL(str, options);
    }

    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     */
    isUUID(str: string, version?: number): boolean {
        return this.validator.isUUID(str, version);
    }

    /**
     * Checks if the string is uppercase.
     */
    isUppercase(str: string): boolean {
        return this.validator.isUppercase(str);
    }

    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     */
    matches(str: string, pattern: RegExp, modifiers?: string): boolean {
        return this.validator.matches(str, pattern, modifiers);
    }

    // -------------------------------------------------------------------------
    // Sanitization Methods
    // -------------------------------------------------------------------------

    /**
     * Remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to
     * escape some chars, e.g @Blacklist('\\[\\]')
     */
    blacklist(str: string, chars: RegExp): string {
        return this.validator.blacklist(str, chars);
    }

    /**
     * Replace <, >, &, ', " and / with HTML entities.
     */
    escape(str: string): string {
        return this.validator.escape(str);
    }

    /**
     * Trim characters from the left-side of the input.
     */
    ltrim(str: string, chars?: string[]): string {
        return this.validator.ltrim(str, chars);
    }

    /**
     * Canonicalize an email address.
     */
    normalizeEmail(str: string, lowercase?: boolean): string {
        return this.validator.normalizeEmail(str, lowercase);
    }

    /**
     * Trim characters from the right-side of the input.
     */
    rtrim(str: string, chars?: string[]): string {
        return this.validator.rtrim(str, chars);
    }

    /**
     * Remove characters with a numerical value < 32 and 127, mostly control characters.
     * If keepNewLines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD).
     * Unicode-safe in JavaScript.
     */
    stripLow(str: string, keepNewLines?: boolean): string {
        return this.validator.stripLow(str, keepNewLines);
    }

    /**
     * Convert the input to a boolean.
     * Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
     */
    toBoolean(input: any, isStrict?: boolean): boolean {
        return this.validator.toBoolean(input, isStrict);
    }

    /**
     * Convert the input to a date, or null if the input is not a date.
     */
    toDate(input: any): Date {
        return this.validator.toDate(input);
    }

    /**
     * Convert the input to a float.
     */
    toFloat(input: any): number {
        return this.validator.toFloat(input);
    }

    /**
     * Convert the input to an integer, or NaN if the input is not an integer.
     */
    toInt(input: any, radix?: number): number {
        return this.validator.toInt(input, radix);
    }

    /**
     * Convert the input to a string.
     */
    toString(input: any): string {
        return this.validator.toString(input);
    }

    /**
     * Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.
     */
    trim(str: string, chars?: string[]): string {
        return this.validator.trim(str, chars);
    }

    /**
     * Remove characters that do not appear in the whitelist.
     * The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]').
     */
    whitelist(str: string, chars: RegExp): string {
        return this.validator.whitelist(str, chars);
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

                        return <ValidatorInterface> validatorMetadata.instance;
                    }).every(validator => validator.validate(value));
                break;
        }
        return true;
    }

    private sanitizeValue(value: any, metadata: ValidationMetadata): any {
        switch (metadata.type) {
            case SanitizeTypes.BLACKLIST:
                return this.blacklist(value, metadata.value1);
            case SanitizeTypes.ESCAPE:
                return this.escape(value);
            case SanitizeTypes.LTRIM:
                return this.ltrim(value, metadata.value1);
            case SanitizeTypes.NORMALIZE_EMAIL:
                return this.normalizeEmail(value, metadata.value1);
            case SanitizeTypes.RTRIM:
                return this.rtrim(value, metadata.value1);
            case SanitizeTypes.STRIP_LOW:
                return this.stripLow(value, metadata.value1);
            case SanitizeTypes.TO_BOOLEAN:
                return this.toBoolean(value, metadata.value1);
            case SanitizeTypes.TO_DATE:
                return this.toDate(value);
            case SanitizeTypes.TO_FLOAT:
                return this.toFloat(value);
            case SanitizeTypes.TO_INT:
                return this.toInt(value, metadata.value1);
            case SanitizeTypes.TO_STRING:
                return this.toString(value);
            case SanitizeTypes.TRIM:
                return this.trim(value, metadata.value1);
            case SanitizeTypes.WHITELIST:
                return this.whitelist(value, metadata.value1);
            case SanitizeTypes.CUSTOM_SANITIZATION:
                return this.metadataStorage
                    .getSanitizeConstraintsForObject(metadata.value1)
                    .map(validatorMetadata => {
                        if (!validatorMetadata.instance)
                            validatorMetadata.instance = this.createInstance(validatorMetadata.object);

                        return <SanitizerInterface> validatorMetadata.instance;
                    }).reduce((result, validator) => validator.sanitize(result), value);

            default:
                throw Error(`Wrong sanitization type is supplied ${metadata.type} for value ${value}`);
        }
    }

    private createInstance(object: Function): ValidatorInterface|SanitizerInterface {
        return this._container ? this._container.get(object) : new (<any> object)();
    }

}