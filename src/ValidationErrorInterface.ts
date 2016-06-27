/**
 * Validation error description.
 */
export interface ValidationErrorInterface {
    objectClass: Function;
    property: string;
    errorCode: string;
    errorMessage: string;
    value: any;
    required: any;
}