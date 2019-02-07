"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var container_1 = require("../container");
/**
 * This metadata interface contains information for custom validators.
 */
var ConstraintMetadata = /** @class */ (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ConstraintMetadata(target, name, async) {
        if (async === void 0) { async = false; }
        this.target = target;
        this.name = name;
        this.async = async;
    }
    Object.defineProperty(ConstraintMetadata.prototype, "instance", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        /**
         * Instance of the target custom validation class which performs validation.
         */
        get: function () {
            return container_1.getFromContainer(this.target);
        },
        enumerable: true,
        configurable: true
    });
    return ConstraintMetadata;
}());
exports.ConstraintMetadata = ConstraintMetadata;

//# sourceMappingURL=ConstraintMetadata.js.map
