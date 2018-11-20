import {ValidationOptions} from "./ValidationOptions";
import {buildMessage, ValidateBy} from "./ValidateBy";
import validatorJsMatches = require("validator/lib/matches");

export const MATCHES = "matches";

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
 * If given value is not a string, then it returns false.
 */
export function matches(value: string, pattern: RegExp, modifiers?: string): boolean {
    return typeof value === "string" && validatorJsMatches(value, pattern, modifiers);
}

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
 */
export function Matches(pattern: RegExp, validationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiers?: string, validationOptions?: ValidationOptions): Function;
export function Matches(pattern: RegExp, modifiersOrAnnotationOptions?: string | ValidationOptions, validationOptions?: ValidationOptions): Function {
    let modifiers: string;
    if (modifiersOrAnnotationOptions && modifiersOrAnnotationOptions instanceof Object && !validationOptions) {
        validationOptions = modifiersOrAnnotationOptions as ValidationOptions;
    } else {
        modifiers = modifiersOrAnnotationOptions as string;
    }
    return ValidateBy({
            name: MATCHES,
            validate: (value, args) => matches(value, args.constraints[0]),
            constraints: [pattern, modifiers],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must match $constraint1 regular expression", validationOptions)
        },
        validationOptions
    );
}
