/**
 * Custom validators must implement this interface to provide custom validation logic.
 */
export interface ValidatorConstraintInterface {

    /**
     * Method to be called to perform custom validation over given value.
     */
    validate(value: any, validatingObject: Object): Promise<boolean>|boolean;

}