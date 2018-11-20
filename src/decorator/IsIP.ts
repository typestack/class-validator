import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsIP = require("validator/lib/isIP");

export const IS_IP = "isIp";

/**
 * Checks if the string is an IP (version 4 or 6).
 * If given value is not a string, then it returns false.
 */
export function isIP(value: string, version?: "4" | "6"): boolean {
    // typings for isIP are wrong: JS actually accepts strings and numbers
    const versionNr = version ? Number(version) : undefined;
    return typeof value === "string" && validatorJsIsIP(value, versionNr);
}

/**
 * Checks if the string is an IP (version 4 or 6).
 */
export function IsIP(version?: "4" | "6", validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_IP,
            validate: (value, args) => isIP(value, args.constraints[0]),
            constraints: [version],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an ip address", validationOptions)
        },
        validationOptions
    );
}
