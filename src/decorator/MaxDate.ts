import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";

/**
 * Checks if the value is a date that's before the specified date.
 */
export function maxDate(date: Date, maxDate: Date): boolean {
    return date && date.getTime() <= maxDate.getTime();
}

/**
 * Checks if the value is a date that's before the specified date.
 */
export function MaxDate(date: Date, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: "maxDate",
            validate: (value, args) => maxDate(value, args.constraints[0]),
            constraints: [date],
            defaultMessage: buildMessage((eachPrefix) => "maximal allowed date for " + eachPrefix + "$property is $constraint1", validationOptions)
        },
        validationOptions
    );
}
