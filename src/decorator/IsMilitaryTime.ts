import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import {matches} from "./Matches";

export const IS_MILITARY_TIME = "isMilitaryTime";

/**
 * Checks if the string represents a time without a given timezone in the format HH:MM (military)
 * If the given value does not match the pattern HH:MM, then it returns false.
 */
export function isMilitaryTime(value: string): boolean {
    return matches(value, /^([01]\d|2[0-3]):?([0-5]\d)$/);
}


/**
 * Checks if the string correctly represents a time in the format HH:MM
 */
export function IsMilitaryTime(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_MILITARY_TIME,
            validate: (value) => isMilitaryTime(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a military time", validationOptions)
        },
        validationOptions
    );
}
