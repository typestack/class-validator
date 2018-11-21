import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const MIN_DATE = "minDate";

/**
 * Checks if the value is a date that's after the specified date.
 */
export function minDate(date: Date, minDate: Date): boolean {
    return date && date.getTime() >= minDate.getTime();
}

/**
 * Checks if the value is a date that's after the specified date.
 */
export function MinDate(date: Date, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: MIN_DATE,
            validate: (value, args) => minDate(value, args.constraints[0]),
            constraints: [date],
            defaultMessage: buildMessage((eachPrefix) => "minimal allowed date for " + eachPrefix + "$property is $constraint1", validationOptions)
        },
        validationOptions
    );
}
