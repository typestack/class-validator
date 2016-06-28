/**
 * Custom validators must implement this interface to provide custom validation logic.
 */
export interface ValidatorConstraintInterface {

    /**
     * Method to be called to perform custom validation over given value.
     */
    validate(value: any, validatingObject: Object, constraints: any[]): Promise<boolean>|boolean;

    /**
     * Gets default message when validation for this constraint fail.
     */
    defaultMessage?(value: any, constraints: any[]): string;

}