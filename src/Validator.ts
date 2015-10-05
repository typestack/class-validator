import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {SanitizeTypes} from "./types/SanitizeTypes";
import {ValidationTypes} from "./types/ValidationTypes";
import {MetadataStorage, defaultMetadataStorage} from "./metadata/MetadataStorage";
import {ValidationError} from "./ValidationError";
import {ValidationTypesUtils} from "./types/ValidationTypes";
import {ValidationOptions} from "./ValidationOptions";

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private metadataStorage?: MetadataStorage, private validator?: any) {
        if (!metadataStorage)
            this.metadataStorage = defaultMetadataStorage;
        if (!validator)
            this.validator = require('validator');
    }
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    validate(objectClass: Function, object: any, validationOptions?: ValidationOptions): ValidationError[] {
        let groups = validationOptions ? validationOptions.groups : undefined;
        let metadatas = this.metadataStorage.getValidationMetadatasForObject(objectClass, groups);
        return metadatas.map(metadata => {
            let value = object[metadata.propertyName];
            if (!value && validationOptions && validationOptions.skipMissingProperties === true)
                return null;

            let duplicateMetadatas = metadatas.filter(m => m.propertyName === metadata.propertyName && m.type === metadata.type);
            let errors = duplicateMetadatas.map(m => {
                let isValid = this.performValidation(value, m);
                if (isValid) return null;

                return <ValidationError> {
                    property: m.propertyName,
                    errorCode: m.type,
                    errorName: ValidationTypesUtils.getCodeName(m.type),
                    errorMessage: m.message,
                    value: value
                };
            });

            if (errors.length > 0 && errors.indexOf(null) !== -1)
                return null;

            return errors.reduceRight((found, err) => err !== null ? err : found, null);

        }).filter(error => error !== null);
    }

    sanitize(objectClass: Function, object: any): void {
        let metadatas = this.metadataStorage.getSanitizeMetadatasForObject(objectClass);
        metadatas.forEach(metadata => {
            if (!object[metadata.propertyName]) return;
            object[metadata.propertyName] = this.performSanitization(object[metadata.propertyName], metadata);
        });
    }

    sanitizeAndValidate(objectClass: Function, object: any, validationOptions?: ValidationOptions): ValidationError[] {
        this.sanitize(objectClass, object);
        return this.validate(objectClass, object, validationOptions);
    }

    isValid(objectClass: Function, object: any, validationOptions?: ValidationOptions): boolean {
        return this.validate(objectClass, object, validationOptions).length === 0;
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private performValidation(value: any, metadata: ValidationMetadata): boolean {
        switch (metadata.type) {
            case ValidationTypes.CONTAINS:
                return this.validator.contains(value, metadata.value1);
            case ValidationTypes.EQUALS:
                return this.validator.equals(value, metadata.value1);
            case ValidationTypes.IS_AFTER:
                return this.validator.isAfter(value, metadata.value1);
            case ValidationTypes.IS_ALPHA:
                return this.validator.isAlpha(value);
            case ValidationTypes.IS_ALPHANUMERIC:
                return this.validator.isAlphanumeric(value);
            case ValidationTypes.IS_ASCII:
                return this.validator.isAscii(value);
            case ValidationTypes.IS_BASE64:
                return this.validator.isBase64(value);
            case ValidationTypes.IS_BEFORE:
                return this.validator.isBefore(value, metadata.value1);
            case ValidationTypes.IS_BOOLEAN:
                return this.validator.isBefore(value);
            case ValidationTypes.IS_BYTE_LENGTH:
                return this.validator.isByteLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_CREDIT_CARD:
                return this.validator.isCreditCard(value);
            case ValidationTypes.IS_CURRENCY:
                return this.validator.isCurrency(value, metadata.value1);
            case ValidationTypes.IS_DATE:
                return this.validator.isDate(value);
            case ValidationTypes.IS_DECIMAL:
                return this.validator.isDecimal(value);
            case ValidationTypes.IS_DIVISIBLE_BY:
                return this.validator.isDivisibleBy(value, metadata.value1);
            case ValidationTypes.IS_EMAIL:
                return this.validator.isEmail(value, metadata.value1);
            case ValidationTypes.IS_FQDN:
                return this.validator.isFQDN(value, metadata.value1);
            case ValidationTypes.IS_FLOAT:
                return this.validator.isFloat(value, metadata.value1);
            case ValidationTypes.IS_FULL_WIDTH:
                return this.validator.isFullWidth(value);
            case ValidationTypes.IS_HALF_WIDTH:
                return this.validator.isHalfWidth(value);
            case ValidationTypes.IS_VARIABLE_WIDTH:
                return this.validator.isVariableWidth(value);
            case ValidationTypes.IS_HEX_COLOR:
                return this.validator.isHexColor(value);
            case ValidationTypes.IS_HEXADECIMAL:
                return this.validator.isHexadecimal(value);
            case ValidationTypes.IS_IP:
                return this.validator.isIP(value, metadata.value1);
            case ValidationTypes.IS_ISBN:
                return this.validator.isISBN(value, metadata.value1);
            case ValidationTypes.IS_ISIN:
                return this.validator.isISIN(value);
            case ValidationTypes.IS_ISO8601:
                return this.validator.isISO8601(value);
            case ValidationTypes.IS_IN:
                return this.validator.isIn(value, metadata.value1);
            case ValidationTypes.IS_INT:
                return this.validator.isInt(value, metadata.value1);
            case ValidationTypes.IS_JSON:
                return this.validator.isJSON(value);
            case ValidationTypes.IS_LENGTH:
                return this.validator.isLength(value, metadata.value1, metadata.value2);
            case ValidationTypes.IS_LOWERCASE:
                return this.validator.isLowercase(value);
            case ValidationTypes.IS_MOBILE_PHONE:
                return this.validator.isMobilePhone(value, metadata.value1);
            case ValidationTypes.IS_MONGO_ID:
                return this.validator.isMongoId(value);
            case ValidationTypes.IS_MULTIBYTE:
                return this.validator.isMultibyte(value);
            case ValidationTypes.IS_NULL:
                return this.validator.isNull(value);
            case ValidationTypes.IS_NUMERIC:
                return this.validator.isNumeric(value);
            case ValidationTypes.IS_SURROGATE_PAIR:
                return this.validator.isSurrogatePair(value);
            case ValidationTypes.IS_URL:
                return this.validator.isURL(value, metadata.value1);
            case ValidationTypes.IS_UUID:
                return this.validator.isUUID(value, metadata.value1);
            case ValidationTypes.IS_UPPERCASE:
                return this.validator.isUppercase(value);
            case ValidationTypes.MATCHES:
                return this.validator.matches(value, metadata.value1, metadata.value2);

            // custom validation types
            case ValidationTypes.MIN_LENGTH:
                return this.validator.isLength(value, metadata.value1);
            case ValidationTypes.MAX_LENGTH:
                return this.validator.isLength(value, 0, metadata.value1);
            case ValidationTypes.MIN_NUMBER:
                return this.validator.isInt(value, { min: metadata.value1 });
            case ValidationTypes.MAX_NUMBER:
                return this.validator.isInt(value, { max: metadata.value1 });

            default:
                throw Error('Wrong validation type is supplied (' + metadata.type + ') for value ' + value);
        }
    }

    private performSanitization(value: any, metadata: ValidationMetadata): any {
        switch (metadata.type) {
            case SanitizeTypes.BLACKLIST:
                return this.validator.blacklist(value, metadata.value1);
            case SanitizeTypes.ESCAPE:
                return this.validator.escape(value);
            case SanitizeTypes.LTRIM:
                return this.validator.ltrim(value, metadata.value1);
            case SanitizeTypes.NORMALIZE_EMAIL:
                return this.validator.normalizEmail(value, metadata.value1);
            case SanitizeTypes.RTRIM:
                return this.validator.rtrim(value, metadata.value1);
            case SanitizeTypes.STRIP_LOW:
                return this.validator.stripLow(value, metadata.value1);
            case SanitizeTypes.TO_BOOLEAN:
                return this.validator.toBoolean(value, metadata.value1);
            case SanitizeTypes.TO_DATE:
                return this.validator.toDate(value);
            case SanitizeTypes.TO_FLOAT:
                return this.validator.toFloat(value);
            case SanitizeTypes.TO_INT:
                return this.validator.toInt(value, metadata.value1);
            case SanitizeTypes.TO_STRING:
                return this.validator.toString(value);
            case SanitizeTypes.TRIM:
                return this.validator.trim(value, metadata.value1);
            case SanitizeTypes.WHITELIST:
                return this.validator.whitelist(value, metadata.value1);

            default:
                throw Error('Wrong sanitization type is supplied (' + metadata.type + ') for value ' + value);
        }
    }
}