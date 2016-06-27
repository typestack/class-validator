import {ValidationMetadataArgs} from "./ValidationMetadataArgs";

/**
 * This metadata interface contains information for validation.
 */
export class ValidationMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Validation type.
     */
    type: string;

    /**
     * Object that is used to be validated.
     */
    object: Object;

    /**
     * Property of the object to be validated.
     */
    propertyName: string;

    /**
     * First extra validation metadata value.
     */
    value1: any;

    /**
     * Second extra validation metadata value.
     */
    value2: any;

    /**
     * Validation message to be shown in the case of error.
     */
    message: string;

    /**
     * Validation groups used for this validation.
     */
    groups: string[] = [];

    /**
     * Indicates if validation must be performed always, no matter of validation groups used.
     */
    always: boolean = false;

    /**
     * Specifies if validated value is an array and each of its item must be validated.
     */
    each: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(args: ValidationMetadataArgs) {
        this.type = args.type;
        this.object = args.object;
        this.value1 = args.value1;
        this.value2 = args.value2;
        if (args.validationOptions) {
            this.message = args.validationOptions.message;
            this.groups = args.validationOptions.groups;
            this.always = args.validationOptions.always;
            this.each = args.validationOptions.each;
        }
    }
    
}
