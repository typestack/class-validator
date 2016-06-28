/**
 * Options passed to validator during validation.
 */
export interface ValidatorOptions {

    /**
     * If set to true then validator will skip validation of all properties that are missing in the validating object.
     */
    skipMissingProperties?: boolean;

    /**
     * Groups to be used during validation of the object.
     */
    groups?: string[];

    /**
     * If set to true, the validation will not use default messages.
     * Error message always will be undefined if its not explicitly set.
     */
    dismissDefaultMessages?: boolean;

}