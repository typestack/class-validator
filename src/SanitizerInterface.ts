/**
 * Custom validators must implement this interface to provide custom sanitization logic.
 */
export interface SanitizerInterface {

    /**
     * Method to be called to perform given value sanitization.
     */
    sanitize(value: any): any;

}