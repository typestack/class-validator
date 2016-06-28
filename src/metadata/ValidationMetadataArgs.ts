import {ValidationOptions} from "../decorator/ValidationOptions";

/**
 * Constructor arguments for ValidationMetadata class.
 */
export interface ValidationMetadataArgs {

    /**
     * Validation type.
     */
    type: string;

    /**
     * Object that is used to be validated.
     */
    target: Function|string;

    /**
     * Property of the object to be validated.
     */
    propertyName: string;

    /**
     * Constraint class that performs validation. Used only for custom validations.
     */
    constraintCls?: Function;

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