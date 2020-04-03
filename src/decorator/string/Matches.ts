import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import validator from "validator";

export const MATCHES = "matches";

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i).
 * If given value is not a string, then it returns false.
 */
export function matches(value: unknown, pattern: RegExp): boolean {
    // TODO: breaking change - vyhodene modifiers?: string
    return typeof value === "string" && validator.matches(value, pattern);
}

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i)
 * If given value is not a string, then it returns false.
 */
export function Matches(pattern: RegExp, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: MATCHES,
            constraints: [pattern],
            validator: {
                validate: (value, args) => matches(value, args.constraints[0]),
                defaultMessage: buildMessage(
                    (eachPrefix, args) => eachPrefix + "$property must match $constraint1 regular expression",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
