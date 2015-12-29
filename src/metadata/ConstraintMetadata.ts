import {ValidatorInterface} from "../ValidatorInterface";
import {SanitizerInterface} from "../SanitizerInterface";

/**
 * This metadata interface contains information for custom validators and sanitizers.
 */
export interface ConstraintMetadata {

    /**
     * Inidicates if this constraint is for sanitization or validation.
     */
    sanitize: boolean;

    /**
     * Object class which performs validation/sanitization.
     */
    object: Function;

    /**
     * Instance of the object which performs validation/sanitization.
     */
    instance?: ValidatorInterface|SanitizerInterface;
}
