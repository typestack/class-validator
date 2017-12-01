/**
 * Options passed to validator during validation.
 */
export interface ValidatorOptions {

    /**
     * If set to true than validator will skip validation of all properties that are missing in the validating object.
     */
    skipMissingProperties?: boolean;

    /**
     * If set to true validator will throw an error if any of the properties are missing @Allow decorator.
     * If set to false, all the properties that are missing @Allow decorator will be stripped.
     *
     * **If no properties have @Allow decorator no error will be thrown and no properties will be stripped**
     */
    forbidNotAllowedProperties?: boolean;

    /**
     * Groups to be used during validation of the object.
     */
    groups?: string[];

    /**
     * If set to true, the validation will not use default messages.
     * Error message always will be undefined if its not explicitly set.
     */
    dismissDefaultMessages?: boolean;

    /**
     * ValidationError special options.
     */
    validationError?: {

        /**
         * Indicates if target should be exposed in ValidationError.
         */
        target?: boolean;

        /**
         * Indicates if validated value should be exposed in ValidationError.
         */
        value?: boolean;

    };

}