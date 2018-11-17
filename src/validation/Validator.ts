import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {ValidationTypes} from "./ValidationTypes";
import {ValidationError} from "./ValidationError";
import {IsNumberOptions} from "./ValidationTypeOptions";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationExecutor} from "./ValidationExecutor";
import {ValidationOptions} from "../decorator/ValidationOptions";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    // FIXME: other goal of modularization: remove this!!!!
    private validatorJs = require("validator");

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

            /* string checkers */
            case ValidationTypes.IS_ISO8601:
                return this.isISO8601(value);
            case ValidationTypes.IS_JSON:
                return this.isJSON(value);
            case ValidationTypes.IS_LOWERCASE:
                return this.isLowercase(value);
            case ValidationTypes.IS_MOBILE_PHONE:
                return this.isMobilePhone(value, metadata.constraints[0]);
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
    isDefined(value: any): boolean {
        return value !== undefined && value !== null;
    }

    // -------------------------------------------------------------------------
    // Validation Methods: string checkers
    // -------------------------------------------------------------------------



    /**
     * Checks if the string is a valid ISO 8601 date.
     * If given value is not a string, then it returns false.
     */
    isISO8601(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isISO8601(value);
    }

    /**
     * Checks if the string is valid JSON (note: uses JSON.parse).
     * If given value is not a string, then it returns false.
     */
    isJSON(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isJSON(value);
    }

    /**
     * Checks if the string is lowercase.
     * If given value is not a string, then it returns false.
     */
    isLowercase(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isLowercase(value);
    }

    /**
     * Checks if the string is a mobile phone number (locale is one of ['zh-CN', 'zh-TW', 'en-ZA', 'en-AU', 'en-HK',
     * 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM', 'ru-RU', 'nb-NO', 'nn-NO', 'vi-VN', 'en-NZ']).
     * If given value is not a string, then it returns false.
     */
    isMobilePhone(value: string, locale: ValidatorJS.MobilePhoneLocale): boolean {
        return typeof value === "string" && this.validatorJs.isMobilePhone(value, locale);
    }

    /**
     * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
     * If given value is not a string, then it returns false.
     */
    isMongoId(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isMongoId(value);
    }

    /**
     * Checks if the string contains one or more multibyte chars.
     * If given value is not a string, then it returns false.
     */
    isMultibyte(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isMultibyte(value);
    }

    /**
     * Checks if the string contains any surrogate pairs chars.
     * If given value is not a string, then it returns false.
     */
    isSurrogatePair(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isSurrogatePair(value);
    }

    /**
     * Checks if the string is an url.
     * If given value is not a string, then it returns false.
     */
    isURL(value: string, options?: ValidatorJS.IsURLOptions): boolean {
        return typeof value === "string" && this.validatorJs.isURL(value, options);
    }

    /**
     * Checks if the string is a UUID (version 3, 4 or 5).
     * If given value is not a string, then it returns false.
     */
    isUUID(value: string, version?: "3"|"4"|"5"): boolean {
        return typeof value === "string" && this.validatorJs.isUUID(value, version);
    }

    /**
     * Checks if the string is uppercase.
     * If given value is not a string, then it returns false.
     */
    isUppercase(value: string): boolean {
        return typeof value === "string" && this.validatorJs.isUppercase(value);
    }

    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    length(value: string, min: number, max?: number): boolean {
        return typeof value === "string" && this.validatorJs.isLength(value, min, max);
    }

    /**
     * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    minLength(value: string, min: number) {
        return typeof value === "string" && this.length(value, min);
    }

    /**
     * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    maxLength(value: string, max: number) {
        return typeof value === "string" && this.length(value, 0, max);
    }

    /**
     * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
     * If given value is not a string, then it returns false.
     */
    matches(value: string, pattern: RegExp, modifiers?: string): boolean {
        return typeof value === "string" && this.validatorJs.matches(value, pattern, modifiers);
    }

    /**
     * Checks if the string represents a time without a given timezone in the format HH:MM (military)
     * If the given value does not match the pattern HH:MM, then it returns false.
     */
    isMilitaryTime(value: string): boolean {
        return this.matches(value, /^([01]\d|2[0-3]):?([0-5]\d)$/);
    }

    // -------------------------------------------------------------------------
    // Validation Methods: array checkers
    // -------------------------------------------------------------------------

    /**
     * Checks if array contains all values from the given array of values.
     * If null or undefined is given then this function returns false.
     */
    arrayContains(array: any[], values: any[]) {
        if (!(array instanceof Array))
            return false;

        return !array || values.every(value => array.indexOf(value) !== -1);
    }

    /**
     * Checks if array does not contain any of the given values.
     * If null or undefined is given then this function returns false.
     */
    arrayNotContains(array: any[], values: any[]) {
        if (!(array instanceof Array))
            return false;

        return !array || values.every(value => array.indexOf(value) === -1);
    }

    /**
     * Checks if given array is not empty.
     * If null or undefined is given then this function returns false.
     */
    arrayNotEmpty(array: any[]) {
        if (!(array instanceof Array))
            return false;

        return array instanceof Array && array.length > 0;
    }

    /**
     * Checks if array's length is as minimal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMinSize(array: any[], min: number) {
        if (!(array instanceof Array))
            return false;

        return array instanceof Array && array.length >= min;
    }

    /**
     * Checks if array's length is as maximal this number.
     * If null or undefined is given then this function returns false.
     */
    arrayMaxSize(array: any[], max: number) {
        if (!(array instanceof Array))
            return false;

        return array instanceof Array && array.length <= max;
    }

    /**
     * Checks if all array's values are unique. Comparison for objects is reference-based.
     * If null or undefined is given then this function returns false.
     */
    arrayUnique(array: any[]) {
        if (!(array instanceof Array))
            return false;

        const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
        return array.length === uniqueItems.length;
    }

    /**
     * Checks if the value is an instance of the specified object.
     */
    isInstance(object: any, targetTypeConstructor: new (...args: any[]) => any) {
        return targetTypeConstructor
            && typeof targetTypeConstructor === "function"
            && object instanceof targetTypeConstructor;
    }

}
