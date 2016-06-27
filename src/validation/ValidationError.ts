/**
 * Validation error description.
 */
export interface ValidationError {
    target: Function;
    property: string;
    errorCode: string;
    errorMessage: string;
    value: any;
    required: any;
}