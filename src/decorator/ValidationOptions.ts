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
     * You can use "$value1" and "$value2" keys in the message string, 
     * and they will be replaced with actual required values if they exist.
     * Message can be either string, either a function that returns a string.
     * Second option allows to use values and custom messages depend of them.
     */
    message?: string|((value1?: number, value2?: number) => string);

    /**
     * Validation groups used for this validation.
     */
    groups?: string[];

    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always?: boolean;
    
}