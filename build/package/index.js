"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataStorage_1 = require("./metadata/MetadataStorage");
var Validator_1 = require("./validation/Validator");
var container_1 = require("./container");
// -------------------------------------------------------------------------
// Export everything api users needs
// -------------------------------------------------------------------------
__export(require("./container"));
__export(require("./decorator/decorators"));
__export(require("./validation/ValidationError"));
__export(require("./validation/ValidationTypes"));
__export(require("./validation/Validator"));
__export(require("./register-decorator"));
__export(require("./metadata/MetadataStorage"));
/**
 * Validates given object by object's decorators or given validation schema.
 */
function validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
    if (typeof schemaNameOrObject === "string") {
        return container_1.getFromContainer(Validator_1.Validator).validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
    }
    else {
        return container_1.getFromContainer(Validator_1.Validator).validate(schemaNameOrObject, objectOrValidationOptions);
    }
}
exports.validate = validate;
/**
 * Validates given object by object's decorators or given validation schema and reject on error.
 */
function validateOrReject(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
    if (typeof schemaNameOrObject === "string") {
        return container_1.getFromContainer(Validator_1.Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
    }
    else {
        return container_1.getFromContainer(Validator_1.Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions);
    }
}
exports.validateOrReject = validateOrReject;
/**
 * Validates given object by object's decorators or given validation schema.
 * Note that this method completely ignores async validations.
 * If you want to properly perform validation you need to call validate method instead.
 */
function validateSync(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
    if (typeof schemaNameOrObject === "string") {
        return container_1.getFromContainer(Validator_1.Validator).validateSync(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
    }
    else {
        return container_1.getFromContainer(Validator_1.Validator).validateSync(schemaNameOrObject, objectOrValidationOptions);
    }
}
exports.validateSync = validateSync;
/**
 * Registers a new validation schema.
 */
function registerSchema(schema) {
    container_1.getFromContainer(MetadataStorage_1.MetadataStorage).addValidationSchema(schema);
}
exports.registerSchema = registerSchema;

//# sourceMappingURL=index.js.map
