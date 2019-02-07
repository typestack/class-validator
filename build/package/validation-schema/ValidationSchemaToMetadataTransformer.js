"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationMetadata_1 = require("../metadata/ValidationMetadata");
var ValidationTypes_1 = require("../validation/ValidationTypes");
/**
 * Used to transform validation schemas to validation metadatas.
 */
var ValidationSchemaToMetadataTransformer = /** @class */ (function () {
    function ValidationSchemaToMetadataTransformer() {
    }
    ValidationSchemaToMetadataTransformer.prototype.transform = function (schema) {
        var metadatas = [];
        Object.keys(schema.properties).forEach(function (property) {
            schema.properties[property].forEach(function (validation) {
                if (!ValidationTypes_1.ValidationTypes.isValid(validation.type))
                    throw new Error("Validation schema " + schema.name + "#" + property + " as incorrect type " + validation.type);
                var validationOptions = {
                    message: validation.message,
                    groups: validation.groups,
                    always: validation.always,
                    each: validation.each
                };
                var args = {
                    type: validation.type,
                    target: schema.name,
                    propertyName: property,
                    constraints: validation.constraints,
                    validationTypeOptions: validation.options,
                    validationOptions: validationOptions
                };
                metadatas.push(new ValidationMetadata_1.ValidationMetadata(args));
            });
        });
        return metadatas;
    };
    return ValidationSchemaToMetadataTransformer;
}());
exports.ValidationSchemaToMetadataTransformer = ValidationSchemaToMetadataTransformer;

//# sourceMappingURL=ValidationSchemaToMetadataTransformer.js.map
