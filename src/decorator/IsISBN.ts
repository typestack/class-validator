import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsIsISBN = require("validator/lib/isISBN");


/**
 * Checks if the string is an ISBN (version 10 or 13).
 * If given value is not a string, then it returns false.
 */
export function isISBN(value: string, version?: "10" | "13"): boolean {
    // typings are wrong: JS actually allows string or number
    const versionNr = version ? Number(version) : undefined;
    return typeof value === "string" && validatorJsIsISBN(value, versionNr);
}

/**
 * Checks if the string is an ISBN (version 10 or 13).
 */
export function IsISBN(version?: "10" | "13", validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isIsbn",
            validate: (value, args) => isISBN(value, args.constraints[0]),
            constraints: [version],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be an ISBN", validationOptions)
        },
        validationOptions
    );
}
