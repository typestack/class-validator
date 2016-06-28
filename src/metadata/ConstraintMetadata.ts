import {ValidatorConstraintInterface} from "../validation/ValidatorConstraintInterface";
import {getFromContainer} from "../index";

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

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(target: Function, name?: string) {
        this.target = target;
        this.name = name;
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
