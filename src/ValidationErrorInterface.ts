export interface ValidationErrorInterface {
    objectClass: Function;
    property: string;
    errorCode: number;
    errorName: string;
    errorMessage: string;
    value: any;
    required: any;
}