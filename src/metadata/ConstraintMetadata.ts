import {ValidatorConstraintInterface} from "../validation/ValidatorConstraintInterface";
import {getFromContainer} from "../container";

/**
 * This metadata interface contains information for custom validators.
 */
export class ConstraintMetadata {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Target class which performs validation.
     */
    target: Function;

    /**
     * Custom validation's name, that will be used as validation error type.
     */
    name: string;

    /**
     * Indicates if this validation is asynchronous or not.
     */
    async: boolean;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(target: Function, name?: string, async: boolean = false) {
        this.target = target;
        this.name = name;
        this.async = async;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Instance of the target custom validation class which performs validation.
     */
    get instance(): ValidatorConstraintInterface {
        return getFromContainer<ValidatorConstraintInterface>(this.target);
    }

}
