import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const IS_INSTANCE = "isInstance";

/**
 * Checks if the value is an instance of the specified object.
 */
export function isInstance(object: any, targetTypeConstructor: new (...args: any[]) => any) {
    return targetTypeConstructor
        && typeof targetTypeConstructor === "function"
        && object instanceof targetTypeConstructor;
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 */
export function IsInstance(targetType: new (...args: any[]) => any, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_INSTANCE,
            validate: (value, args) => isInstance(value, args.constraints[0]),
            constraints: [targetType],
            defaultMessage: buildMessage((eachPrefix, args) => {
                if (args.constraints[0]) {
                    return eachPrefix + `$property must be an instance of ${args.constraints[0].name}`;
                } else {
                    return eachPrefix + `${this.IS_INSTANCE} decorator expects and object as value, but got falsy value.`;
                }
            }, validationOptions)
        },
        validationOptions
    );
}
