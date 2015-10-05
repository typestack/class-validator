/**
 * This metadata interface contains information for validation.
 */
export interface ValidationMetadata {
    sanitize: boolean;
    type: number;
    object: Object;
    propertyName: string;
    value1?: any;
    value2?: any;
    message?: string;
    groups?: string[];
    always?: boolean;
}
