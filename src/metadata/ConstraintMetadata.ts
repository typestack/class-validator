import {CustomValidator} from "../validation/CustomValidator";
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

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    
    constructor(target: Function) {
        this.target = target;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Instance of the target custom validation class which performs validation.
     */
    get instance(): CustomValidator {
        return getFromContainer<CustomValidator>(this.target);
    }
    
}
