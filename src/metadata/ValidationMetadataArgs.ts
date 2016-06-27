import {ValidationOptions} from "../ValidationOptions";

export interface ValidationMetadataArgs {

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
    value1?: any;

    /**
     * Second extra validation metadata value.
     */
    value2?: any;

    /**
     * Validation options.
     */
    validationOptions?: ValidationOptions;
}