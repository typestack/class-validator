import {ValidationMetadata} from "./ValidationMetadata";

/**
 * Storage all metadatas of validations.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private _validationMetadatas: ValidationMetadata[] = [];

    // -------------------------------------------------------------------------
    // Getter Methods
    // -------------------------------------------------------------------------

    get validationMetadatas(): ValidationMetadata[] {
        return this._validationMetadatas;
    }

    // -------------------------------------------------------------------------
    // Adder Methods
    // -------------------------------------------------------------------------

    addValidationMetadata(metadata: ValidationMetadata) {
        this.validationMetadatas.push(metadata);
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    getValidationMetadatasForObject(object: Function, groups?: string[]): ValidationMetadata[] {
        return this.validationMetadatas
            .filter(metadata => metadata.object.constructor === object && metadata.sanitize === false)
            .filter(metadata => groups && groups.length > 0 ? metadata.always || (metadata.groups && metadata.groups.filter(g => groups.indexOf(g) !== -1).length > 0) : true);
    }

    getSanitizeMetadatasForObject(object: Object): ValidationMetadata[] {
        return this.validationMetadatas.filter(metadata => metadata.object.constructor === object && metadata.sanitize === true);
    }
}

/**
 * Default metadata storage used as singleton and can be used to storage all metadatas in the system.
 */
export let defaultMetadataStorage = new MetadataStorage();