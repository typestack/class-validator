import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsMongoId = require("validator/lib/isMongoId");

export const IS_MONGO_ID = "isMongoId";

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 * If given value is not a string, then it returns false.
 */
export function isMongoId(value: string): boolean {
    return typeof value === "string" && validatorJsIsMongoId(value);
}

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 */
export function IsMongoId(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_MONGO_ID,
            validate: (value) => isMongoId(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a mongodb id", validationOptions)
        },
        validationOptions
    );
}
