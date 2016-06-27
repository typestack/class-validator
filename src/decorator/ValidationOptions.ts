/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {

    /**
     * Specifies if validated value is an array and each of its item must be validated.
     */
    each?: boolean;

    /**
     * Message used to be shown on validation fail.
     */
    message?: string;

    /**
     * Validation groups used for this validation.
     */
    groups?: string[];

    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always?: boolean;
    
}