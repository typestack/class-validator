import {ValidationMetadata} from "./ValidationMetadata";
import {ConstraintMetadata} from "./ConstraintMetadata";

/**
 * Storage all metadatas.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private validationMetadatas: ValidationMetadata[] = [];
    private constraintMetadatas: ConstraintMetadata[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Adds a new validation metadata.
     */
    addValidationMetadata(metadata: ValidationMetadata) {
        this.validationMetadatas.push(metadata);
    }

    /**
     * Adds a new constraint metadata.
     */
    addConstraintMetadata(metadata: ConstraintMetadata) {
        this.constraintMetadatas.push(metadata);
    }

    /**
     * Gets all validation metadatas for the given object with the given groups.
     */
    getTargetValidationMetadatas(target: Function, groups?: string[]): ValidationMetadata[] {
        return this.validationMetadatas
            .filter(metadata => metadata.target === target)
            .filter(metadata => {
                if (metadata.always) 
                    return true;
                if (groups && groups.length > 0)
                    return metadata.groups && !!metadata.groups.find(group => groups.indexOf(group) !== -1);
                
                return true;
            });
    }

    /**
     * Gets all validator constraints for the given object.
     */
    getTargetValidatorConstraints(target: Function): ConstraintMetadata[] {
        return this.constraintMetadatas.filter(metadata => metadata.target === target);
    }

}