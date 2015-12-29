import {ValidationMetadata} from "./ValidationMetadata";
import {ValidatorInterface} from "../ValidatorInterface";
import {ConstraintMetadata} from "./ConstraintMetadata";

/**
 * Storage all metadatas of validations.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _validationMetadatas: ValidationMetadata[] = [];
    private _constraintMetadatas: ConstraintMetadata[] = [];

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    /**
     * Gets all validation metadatas saved in this storage.
     */
    get validationMetadatas(): ValidationMetadata[] {
        return this._validationMetadatas;
    }

    /**
     * Gets all constraint metadatas saved in this storage.
     */
    get constraintMetadatas(): ConstraintMetadata[] {
        return this._constraintMetadatas;
    }

    // -------------------------------------------------------------------------
    // Adder Methods
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

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Gets all validation metadatas for the given object with the given groups.
     */
    getValidationMetadatasForObject(object: Function, groups?: string[]): ValidationMetadata[] {
        return this.validationMetadatas
            .filter(metadata => metadata.object.constructor === object && metadata.sanitize === false)
            .filter(metadata => groups && groups.length > 0 ? metadata.always || (metadata.groups && metadata.groups.filter(g => groups.indexOf(g) !== -1).length > 0) : true);
    }

    /**
     * Gets all sanitization metadatas for the given object with the given groups.
     */
    getSanitizeMetadatasForObject(object: Object): ValidationMetadata[] {
        return this.validationMetadatas.filter(metadata => metadata.object.constructor === object && metadata.sanitize === true);
    }

    /**
     * Gets all validator constraints for the given object.
     */
    getValidatorConstraintsForObject(object: Function): ConstraintMetadata[] {
        return this.constraintMetadatas.filter(metadata => metadata.object === object && metadata.sanitize === false);
    }

    /**
     * Gets all sanitizator constraints for the given object.
     */
    getSanitizeConstraintsForObject(object: Function): ConstraintMetadata[] {
        return this.constraintMetadatas.filter(metadata => metadata.object === object && metadata.sanitize === true);
    }
}

/**
 * Default metadata storage used as singleton and can be used to storage all metadatas in the system.
 */
export let defaultMetadataStorage = new MetadataStorage();