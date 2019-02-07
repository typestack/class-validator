"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataStorage_1 = require("./metadata/MetadataStorage");
var ConstraintMetadata_1 = require("./metadata/ConstraintMetadata");
var ValidationMetadata_1 = require("./metadata/ValidationMetadata");
var ValidationTypes_1 = require("./validation/ValidationTypes");
var container_1 = require("./container");
/**
 * Registers a custom validation decorator.
 */
function registerDecorator(options) {
    var constraintCls;
    if (options.validator instanceof Function) {
        constraintCls = options.validator;
    }
    else {
        var validator_1 = options.validator;
        constraintCls = /** @class */ (function () {
            function CustomConstraint() {
            }
            CustomConstraint.prototype.validate = function (value, validationArguments) {
                return validator_1.validate(value, validationArguments);
            };
            CustomConstraint.prototype.defaultMessage = function (validationArguments) {
                if (validator_1.defaultMessage) {
                    return validator_1.defaultMessage(validationArguments);
                }
                return "";
            };
            return CustomConstraint;
        }());
        container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addConstraintMetadata(new ConstraintMetadata_1.ConstraintMetadata(constraintCls, options.name, options.async));
    }
    var validationMetadataArgs = {
        type: ValidationTypes_1.ValidationTypes.CUSTOM_VALIDATION,
        target: options.target,
        propertyName: options.propertyName,
        validationOptions: options.options,
        constraintCls: constraintCls,
        constraints: options.constraints
    };
    container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationMetadata(new ValidationMetadata_1.ValidationMetadata(validationMetadataArgs));
}
exports.registerDecorator = registerDecorator;

//# sourceMappingURL=register-decorator.js.map
