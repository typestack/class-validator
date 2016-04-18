import {ValidatorInterface} from "../ValidatorInterface";

/**
 * This metadata interface contains information for custom validators.
 */
export interface ConstraintMetadata {

    /**
     * Object class which performs validation.
     */
    object: Function;

    /**
     * Instance of the object which performs validation.
     */
    instance?: ValidatorInterface;
    
}
