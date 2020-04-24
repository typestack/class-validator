import { ValidationOptions } from "../ValidationOptions";
import { buildMessage, ValidateBy } from "../common/ValidateBy";
import { isObject } from "../typechecker/IsObject";

export const IS_NOT_EMPTY_OBJECT = "isNotEmptyObject";

/**
 * Checks if the value is valid Object & not empty.
 * Returns false if the value is not an object or an empty valid object.
 */
export function isNotEmptyObject(value: unknown): boolean {
    if (!isObject(value)) {
        return false;
    }
    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            return true;
        }
    }

    return false;
}

/**
 * Checks if the value is valid Object & not empty.
 * Returns false if the value is not an object or an empty valid object.
 */
export function IsNotEmptyObject(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_NOT_EMPTY_OBJECT,
            validator: {
                validate: (value, args): boolean => isNotEmptyObject(value),
                defaultMessage: buildMessage(
                    (eachPrefix) => eachPrefix + "$property must be a non-empty object",
                    validationOptions
                )
            }
        },
        validationOptions
    );
}
