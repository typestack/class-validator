export interface ValidationError {
    objectClass: Function;
    property: string;
    errorCode: number;
    errorName: string;
    errorMessage: string;
    value: any;
    expectedValue: any;
}