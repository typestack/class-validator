import {ValidationMetadata} from "../metadata/ValidationMetadata";
/**
 * Custom validators must implement this interface to provide custom validation logic.
 */
export interface CustomValidator {

    /**
     * Method to be called to perform custom validation over given value.
     */
    validate(value: any, metadata: ValidationMetadata): Promise<boolean>|boolean;

}