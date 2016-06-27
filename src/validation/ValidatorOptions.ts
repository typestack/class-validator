/**
 * Options passed to validator during validation.
 */
export interface ValidatorOptions {

    /**
     * If set to true then validator will skip validation of all properties that are missing in the document.
     */
    skipMissingProperties?: boolean;

    /**
     * Groups to be used during validation of the object.
     */
    groups?: string[];

}