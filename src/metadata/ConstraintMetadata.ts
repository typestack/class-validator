import {ValidatorInterface} from "../ValidatorInterface";
import {SanitizerInterface} from "../SanitizerInterface";

/**
 * This metadata interface contains information for custom validators and sanitizers.
 */
export interface ConstraintMetadata {
    sanitize: boolean;
    object: Function;
    instance?: ValidatorInterface|SanitizerInterface;
}
