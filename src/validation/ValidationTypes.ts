import {ValidationArguments} from "./ValidationArguments";

/**
 * Validation types.
 */
export class ValidationTypes {

    /* system */
    static CUSTOM_VALIDATION = "customValidation";
    static NESTED_VALIDATION = "nestedValidation";
    static CONDITIONAL_VALIDATION = "conditionalValidation";
    static WHITELIST = "whitelistValidation";
    // FIXME: delete?
    static IS_DEFINED = "isDefined";

    /* array checkers */
    static ARRAY_CONTAINS = "arrayContains";
    static ARRAY_NOT_CONTAINS = "arrayNotContains";
    static ARRAY_NOT_EMPTY = "arrayNotEmpty";
    static ARRAY_MIN_SIZE = "arrayMinSize";
    static ARRAY_MAX_SIZE = "arrayMaxSize";
    static ARRAY_UNIQUE = "arrayUnique";

    /* object chekers */
    static IS_INSTANCE = "isInstance";

    /**
     * Checks if validation type is valid.
     */
    static isValid(type: string) {
        return  type !== "isValid" &&
            type !== "getMessage" &&
            Object.keys(this).map(key => (this as any)[key]).indexOf(type) !== -1;
    }

    /**
     * Gets default validation error message for the given validation type.
     */
    static getMessage(type: string, isEach: boolean): string|((args: ValidationArguments) => string) {
        const eachPrefix = isEach ? "each value in " : "";
        switch (type) {

            /* system chceck */
            case this.NESTED_VALIDATION:
                return eachPrefix + "nested property $property must be either object or array";
            case this.IS_DEFINED:
                return eachPrefix + "$property should not be null or undefined";

            /* array checkers */
            case this.ARRAY_CONTAINS:
                return eachPrefix + "$property must contain $constraint1 values";
            case this.ARRAY_NOT_CONTAINS:
                return eachPrefix + "$property should not contain $constraint1 values";
            case this.ARRAY_NOT_EMPTY:
                return eachPrefix + "$property should not be empty";
            case this.ARRAY_MIN_SIZE:
                return eachPrefix + "$property must contain at least $constraint1 elements";
            case this.ARRAY_MAX_SIZE:
                return eachPrefix + "$property must contain not more than $constraint1 elements";
            case this.ARRAY_UNIQUE:
                return eachPrefix + "All $property's elements must be unique";

            case this.IS_INSTANCE:
                return (args: ValidationArguments) => {
                    if (args.constraints[0]) {
                        return eachPrefix + `$property must be an instance of ${args.constraints[0].name}`;
                    } else {
                        return eachPrefix + `${this.IS_INSTANCE} decorator expects and object as value, but got falsy value.`;
                    }
                };
            default:
                return "";
        }
    }

}
