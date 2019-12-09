"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validation error description.
 */
var ValidationError = /** @class */ (function () {
    function ValidationError() {
    }
    /**
     *
     * @param shouldDecorate decorate the message with ANSI formatter escape codes for better readability
     * @param hasParent true when the error is a child of an another one
     * @param parentPath path as string to the parent of this property
     */
    ValidationError.prototype.toString = function (shouldDecorate, hasParent, parentPath) {
        var _this = this;
        if (shouldDecorate === void 0) { shouldDecorate = false; }
        if (hasParent === void 0) { hasParent = false; }
        if (parentPath === void 0) { parentPath = ""; }
        var boldStart = shouldDecorate ? "\u001B[1m" : "";
        var boldEnd = shouldDecorate ? "\u001B[22m" : "";
        var propConstraintFailed = function (propertyName) { return " - property " + boldStart + parentPath + propertyName + boldEnd + " has failed the following constraints: " + boldStart + Object.keys(_this.constraints).join(", ") + boldEnd + " \n"; };
        if (!hasParent) {
            return "An instance of " + boldStart + (this.target ? this.target.constructor.name : "an object") + boldEnd + " has failed the validation:\n" +
                (this.constraints ? propConstraintFailed(this.property) : "") +
                this.children
                    .map(function (childError) { return childError.toString(shouldDecorate, true, _this.property); })
                    .join("");
        }
        else {
            // we format numbers as array indexes for better readability.
            var formattedProperty_1 = Number.isInteger(+this.property) ? "[" + this.property + "]" : "" + (parentPath ? "." : "") + this.property;
            if (this.constraints) {
                return propConstraintFailed(formattedProperty_1);
            }
            else {
                return this.children
                    .map(function (childError) { return childError.toString(shouldDecorate, true, "" + parentPath + formattedProperty_1); })
                    .join("");
            }
        }
    };
    return ValidationError;
}());
exports.ValidationError = ValidationError;

//# sourceMappingURL=ValidationError.js.map
