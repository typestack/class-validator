import { ValidationArguments } from "../validation/ValidationArguments";
/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {
    /**
     * Specifies if validated value is an array and each of its item must be validated.
     */
    each?: boolean;
    /**
     * Error message used to be used on validation fail.
     * Message can be either string, either a function that returns a string.
     */
    message?: string | ((validationArguments: ValidationArguments) => string);
    /**
     * Validation groups used for this validation.
     */
    groups?: string[];
    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always?: boolean;
    context?: any;
}
