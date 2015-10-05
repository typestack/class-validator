export interface ValidationError {
    property: string;
    errorCode: number;
    errorName: string;
    errorMessage: string;
    value: any;
}