/**
 * This metadata interface contains information for validation.
 */
export interface ValidationMetadata {

    /**
     * Validation type.
     */
    type: number;

    /**
     * Object that is used to be validated.
     */
    object: Object;

    /**
     * Property of the object to be validated.
     */
    propertyName: string;

    /**
     * First extra validation metadata value.
     */
    value1?: any;

    /**
     * Second extra validation metadata value.
     */
    value2?: any;

    /**
     * Validation message to be shown in the case of error.
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

    /**
     * Specifies if validated value is an array and each of its item must be validated.
     */
    each?: boolean;
    
}
