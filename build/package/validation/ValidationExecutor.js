"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationError_1 = require("./ValidationError");
var MetadataStorage_1 = require("../metadata/MetadataStorage");
var container_1 = require("../container");
var ValidationTypes_1 = require("./ValidationTypes");
var ValidationUtils_1 = require("./ValidationUtils");
var utils_1 = require("../utils");
/**
 * Executes validation over given object.
 */
var ValidationExecutor = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ValidationExecutor(validator, validatorOptions) {
        this.validator = validator;
        this.validatorOptions = validatorOptions;
        // -------------------------------------------------------------------------
        // Properties
        // -------------------------------------------------------------------------
        this.awaitingPromises = [];
        this.ignoreAsyncValidations = false;
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        this.metadataStorage = container_1.getFromContainer(MetadataStorage_1.MetadataStorage);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    ValidationExecutor.prototype.execute = function (object, targetSchema, validationErrors) {
        var _this = this;
        /**
         * If there is no metadata registered it means possibly the dependencies are not flatterned and
         * more than one instance is used.
         *
         * TODO: This needs proper handling, forcing to use the same container or some other proper solution.
         */
        if (!this.metadataStorage.hasValidationMetaData) {
            console.warn("No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.");
        }
        var groups = this.validatorOptions ? this.validatorOptions.groups : undefined;
        var targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, targetSchema, groups);
        var groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);
        if (this.validatorOptions && this.validatorOptions.forbidUnknownValues && !targetMetadatas.length) {
            var validationError = new ValidationError_1.ValidationError();
            if (!this.validatorOptions ||
                !this.validatorOptions.validationError ||
                this.validatorOptions.validationError.target === undefined ||
                this.validatorOptions.validationError.target === true)
                validationError.target = object;
            validationError.value = undefined;
            validationError.property = undefined;
            validationError.children = [];
            validationError.constraints = { unknownValue: "an unknown value was passed to the validate function" };
            validationErrors.push(validationError);
            return;
        }
        if (this.validatorOptions && this.validatorOptions.whitelist)
            this.whitelist(object, groupedMetadatas, validationErrors);
        // General validation
        Object.keys(groupedMetadatas).forEach(function (propertyName) {
            var value = object[propertyName];
            var definedMetadatas = groupedMetadatas[propertyName].filter(function (metadata) { return metadata.type === ValidationTypes_1.ValidationTypes.IS_DEFINED; });
            var metadatas = groupedMetadatas[propertyName].filter(function (metadata) { return metadata.type !== ValidationTypes_1.ValidationTypes.IS_DEFINED && metadata.type !== ValidationTypes_1.ValidationTypes.WHITELIST; });
            if (value instanceof Promise && metadatas.find(function (metadata) { return metadata.type === ValidationTypes_1.ValidationTypes.PROMISE_VALIDATION; })) {
                _this.awaitingPromises.push(value.then(function (resolvedValue) {
                    _this.performValidations(object, resolvedValue, propertyName, definedMetadatas, metadatas, validationErrors);
                }));
            }
            else {
                _this.performValidations(object, value, propertyName, definedMetadatas, metadatas, validationErrors);
            }
        });
    };
    ValidationExecutor.prototype.whitelist = function (object, groupedMetadatas, validationErrors) {
        var _this = this;
        var notAllowedProperties = [];
        Object.keys(object).forEach(function (propertyName) {
            // does this property have no metadata?
            if (!groupedMetadatas[propertyName] || groupedMetadatas[propertyName].length === 0)
                notAllowedProperties.push(propertyName);
        });
        if (notAllowedProperties.length > 0) {
            if (this.validatorOptions && this.validatorOptions.forbidNonWhitelisted) {
                // throw errors
                notAllowedProperties.forEach(function (property) {
                    var _a;
                    var validationError = _this.generateValidationError(object, object[property], property);
                    validationError.constraints = (_a = {}, _a[ValidationTypes_1.ValidationTypes.WHITELIST] = "property " + property + " should not exist", _a);
                    validationError.children = undefined;
                    validationErrors.push(validationError);
                });
            }
            else {
                // strip non allowed properties
                notAllowedProperties.forEach(function (property) { return delete object[property]; });
            }
        }
    };
    ValidationExecutor.prototype.stripEmptyErrors = function (errors) {
        var _this = this;
        return errors.filter(function (error) {
            if (error.children) {
                error.children = _this.stripEmptyErrors(error.children);
            }
            if (Object.keys(error.constraints).length === 0) {
                if (error.children.length === 0) {
                    return false;
                }
                else {
                    delete error.constraints;
                }
            }
            return true;
        });
    };
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    ValidationExecutor.prototype.performValidations = function (object, value, propertyName, definedMetadatas, metadatas, validationErrors) {
        var customValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes_1.ValidationTypes.CUSTOM_VALIDATION; });
        var nestedValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes_1.ValidationTypes.NESTED_VALIDATION; });
        var conditionalValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes_1.ValidationTypes.CONDITIONAL_VALIDATION; });
        var validationError = this.generateValidationError(object, value, propertyName);
        validationErrors.push(validationError);
        var canValidate = this.conditionalValidations(object, value, conditionalValidationMetadatas);
        if (!canValidate) {
            return;
        }
        // handle IS_DEFINED validation type the special way - it should work no matter skipUndefinedProperties/skipMissingProperties is set or not
        this.defaultValidations(object, value, definedMetadatas, validationError.constraints);
        this.mapContexts(object, value, definedMetadatas, validationError);
        if (value === undefined && this.validatorOptions && this.validatorOptions.skipUndefinedProperties === true) {
            return;
        }
        if (value === null && this.validatorOptions && this.validatorOptions.skipNullProperties === true) {
            return;
        }
        if ((value === null || value === undefined) && this.validatorOptions && this.validatorOptions.skipMissingProperties === true) {
            return;
        }
        this.defaultValidations(object, value, metadatas, validationError.constraints);
        this.customValidations(object, value, customValidationMetadatas, validationError.constraints);
        this.nestedValidations(value, nestedValidationMetadatas, validationError.children);
        this.mapContexts(object, value, metadatas, validationError);
        this.mapContexts(object, value, customValidationMetadatas, validationError);
    };
    ValidationExecutor.prototype.generateValidationError = function (object, value, propertyName) {
        var validationError = new ValidationError_1.ValidationError();
        if (!this.validatorOptions ||
            !this.validatorOptions.validationError ||
            this.validatorOptions.validationError.target === undefined ||
            this.validatorOptions.validationError.target === true)
            validationError.target = object;
        if (!this.validatorOptions ||
            !this.validatorOptions.validationError ||
            this.validatorOptions.validationError.value === undefined ||
            this.validatorOptions.validationError.value === true)
            validationError.value = value;
        validationError.property = propertyName;
        validationError.children = [];
        validationError.constraints = {};
        return validationError;
    };
    ValidationExecutor.prototype.conditionalValidations = function (object, value, metadatas) {
        return metadatas
            .map(function (metadata) { return metadata.constraints[0](object, value); })
            .reduce(function (resultA, resultB) { return resultA && resultB; }, true);
    };
    ValidationExecutor.prototype.defaultValidations = function (object, value, metadatas, errorMap) {
        var _this = this;
        return metadatas
            .filter(function (metadata) {
            if (metadata.each) {
                if (value instanceof Array || value instanceof Set || value instanceof Map) {
                    var arrayValue = utils_1.convertToArray(value);
                    return !arrayValue.every(function (subValue) { return _this.validator.validateValueByMetadata(subValue, metadata); });
                }
            }
            else {
                return !_this.validator.validateValueByMetadata(value, metadata);
            }
        })
            .forEach(function (metadata) {
            var _a = _this.createValidationError(object, value, metadata), key = _a[0], message = _a[1];
            errorMap[key] = message;
        });
    };
    ValidationExecutor.prototype.customValidations = function (object, value, metadatas, errorMap) {
        var _this = this;
        metadatas.forEach(function (metadata) {
            container_1.getFromContainer(MetadataStorage_1.MetadataStorage)
                .getTargetValidatorConstraints(metadata.constraintCls)
                .forEach(function (customConstraintMetadata) {
                if (customConstraintMetadata.async && _this.ignoreAsyncValidations)
                    return;
                var validationArguments = {
                    targetName: object.constructor ? object.constructor.name : undefined,
                    property: metadata.propertyName,
                    object: object,
                    value: value,
                    constraints: metadata.constraints
                };
                if (!metadata.each || !(value instanceof Array || value instanceof Set || value instanceof Map)) {
                    var validatedValue = customConstraintMetadata.instance.validate(value, validationArguments);
                    if (utils_1.isPromise(validatedValue)) {
                        var promise = validatedValue.then(function (isValid) {
                            if (!isValid) {
                                var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                                errorMap[type] = message;
                            }
                        });
                        _this.awaitingPromises.push(promise);
                    }
                    else {
                        if (!validatedValue) {
                            var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                            errorMap[type] = message;
                        }
                    }
                    return;
                }
                // convert set and map into array
                var arrayValue = utils_1.convertToArray(value);
                // Validation needs to be applied to each array item
                var validatedSubValues = arrayValue.map(function (subValue) { return customConstraintMetadata.instance.validate(subValue, validationArguments); });
                var validationIsAsync = validatedSubValues
                    .some(function (validatedSubValue) { return utils_1.isPromise(validatedSubValue); });
                if (validationIsAsync) {
                    // Wrap plain values (if any) in promises, so that all are async
                    var asyncValidatedSubValues = validatedSubValues
                        .map(function (validatedSubValue) { return utils_1.isPromise(validatedSubValue) ? validatedSubValue : Promise.resolve(validatedSubValue); });
                    var asyncValidationIsFinishedPromise = Promise.all(asyncValidatedSubValues)
                        .then(function (flatValidatedValues) {
                        var validationResult = flatValidatedValues.every(function (isValid) { return isValid; });
                        if (!validationResult) {
                            var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                            errorMap[type] = message;
                        }
                    });
                    _this.awaitingPromises.push(asyncValidationIsFinishedPromise);
                    return;
                }
                var validationResult = validatedSubValues.every(function (isValid) { return isValid; });
                if (!validationResult) {
                    var _b = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _b[0], message = _b[1];
                    errorMap[type] = message;
                }
            });
        });
    };
    ValidationExecutor.prototype.nestedPromiseValidations = function (value, metadatas, errors) {
        var _this = this;
        if (!(value instanceof Promise)) {
            return;
        }
        this.awaitingPromises.push(value.then(function (resolvedValue) { return _this.nestedValidations(resolvedValue, metadatas, errors); }));
    };
    ValidationExecutor.prototype.nestedValidations = function (value, metadatas, errors) {
        var _this = this;
        if (value === void 0) {
            return;
        }
        metadatas.forEach(function (metadata) {
            var _a;
            if (metadata.type !== ValidationTypes_1.ValidationTypes.NESTED_VALIDATION &&
                metadata.type !== ValidationTypes_1.ValidationTypes.PROMISE_VALIDATION) {
                return;
            }
            var targetSchema = typeof metadata.target === "string" ? metadata.target : undefined;
            if (value instanceof Array || value instanceof Set || value instanceof Map) {
                // Treats Set as an array - as index of Set value is value itself and it is common case to have Object as value
                var arrayLikeValue = value instanceof Set ? Array.from(value) : value;
                arrayLikeValue.forEach(function (subValue, index) {
                    var validationError = _this.generateValidationError(value, subValue, index.toString());
                    errors.push(validationError);
                    _this.execute(subValue, targetSchema, validationError.children);
                });
            }
            else if (value instanceof Object) {
                _this.execute(value, targetSchema, errors);
            }
            else {
                var error = new ValidationError_1.ValidationError();
                error.value = value;
                error.property = metadata.propertyName;
                error.target = metadata.target;
                var _b = _this.createValidationError(metadata.target, value, metadata), type = _b[0], message = _b[1];
                error.constraints = (_a = {},
                    _a[type] = message,
                    _a);
                errors.push(error);
            }
        });
    };
    ValidationExecutor.prototype.mapContexts = function (object, value, metadatas, error) {
        var _this = this;
        return metadatas
            .forEach(function (metadata) {
            if (metadata.context) {
                var customConstraint = void 0;
                if (metadata.type === ValidationTypes_1.ValidationTypes.CUSTOM_VALIDATION) {
                    var customConstraints = _this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls);
                    customConstraint = customConstraints[0];
                }
                var type = _this.getConstraintType(metadata, customConstraint);
                if (error.constraints[type]) {
                    if (!error.contexts) {
                        error.contexts = {};
                    }
                    error.contexts[type] = Object.assign((error.contexts[type] || {}), metadata.context);
                }
            }
        });
    };
    ValidationExecutor.prototype.createValidationError = function (object, value, metadata, customValidatorMetadata) {
        var targetName = object.constructor ? object.constructor.name : undefined;
        var type = this.getConstraintType(metadata, customValidatorMetadata);
        var validationArguments = {
            targetName: targetName,
            property: metadata.propertyName,
            object: object,
            value: value,
            constraints: metadata.constraints
        };
        var message = metadata.message;
        if (!metadata.message &&
            (!this.validatorOptions || (this.validatorOptions && !this.validatorOptions.dismissDefaultMessages))) {
            if (customValidatorMetadata && customValidatorMetadata.instance.defaultMessage instanceof Function) {
                message = customValidatorMetadata.instance.defaultMessage(validationArguments);
            }
            if (!message)
                message = ValidationTypes_1.ValidationTypes.getMessage(type, metadata.each);
        }
        var messageString = ValidationUtils_1.ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
        return [type, messageString];
    };
    ValidationExecutor.prototype.getConstraintType = function (metadata, customValidatorMetadata) {
        var type = customValidatorMetadata && customValidatorMetadata.name ? customValidatorMetadata.name : metadata.type;
        return type;
    };
    return ValidationExecutor;
}());
exports.ValidationExecutor = ValidationExecutor;

//# sourceMappingURL=ValidationExecutor.js.map
