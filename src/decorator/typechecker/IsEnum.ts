import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";

export const IS_ENUM = "isEnum";

/**
 * Checks if a given value is an enum
 */
export function isEnum(value: any, entity: any): boolean {
    const enumValues = Object.keys(entity)
        .map(k => entity[k]);
    return enumValues.indexOf(value) >= 0;
}

/**
 * Checks if a value is a number enum.
 */
export function IsEnum(entity: Object, validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_ENUM,
            validate: (value, args) => isEnum(value, args.constraints[0]),
            constraints: [entity],
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a valid enum value", validationOptions)
        },
        validationOptions
    );
}
