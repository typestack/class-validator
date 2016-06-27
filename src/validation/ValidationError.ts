/**
 * Validation error description.
 */
export interface ValidationError {
    
    /**
     * Validation's target class.
     */
    // target: Function;

    /**
     * Target's property on which validation is applied.
     */
    property: string;

    /**
     * Error's type.
     */
    type: string;

    /**
     * Error's message.
     */
    message: string;

    /**
     * Value of that target's property, that didn't pass a validation.
     */
    value: any;
    
}