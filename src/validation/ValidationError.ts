/**
 * Validation error description.
 */
export interface ValidationError {

    /**
     * If this was a result of nested validation, this property will contain a parent from where this validation came.
     */
    parentTarget?: Object;

    /**
     * If this was a result of nested validation, this property will contain a name of the property in the parent of
     * this validation.
     */
    parentProperty?: string;
    
    /**
     * Name of the target class that was validated.
     */
    target: string;

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