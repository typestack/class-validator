import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {isString} from "./IsString";

/**
 * Checks if a given value is a ISOString date.
 */
export function isDateString(value: any): boolean {
    const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|\+[0-2]\d(?:\:[0-5]\d)?)?/g;
    return isString(value) && regex.test(value);
}

export function IsDateString(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "isDateString",
            validate: (value) => isDateString(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a ISOString", validationOptions)
        },
        validationOptions
    );
}
