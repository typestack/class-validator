import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsUUID = require("validator/lib/isUUID");

export const IS_UUID = "isUuid";

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 * If given value is not a string, then it returns false.
 */
export function isUUID(value: string, version?: 3|4|5|"3"|"4"|"5"|"all"): boolean {
    return typeof value === "string" && validatorJsIsUUID(value, version);
}

/**
 * Checks if the string is a UUID (version 3, 4 or 5).
 */
export function IsUUID(version?: 3|4|5|"3"|"4"|"5"|"all", validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_UUID,
            validate: (value, args) => isUUID(value, args.constraints[0]),
            constraints: [version],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an UUID", validationOptions)
        },
        validationOptions
    );
}
