import {ValidationMetadata} from "./ValidationMetadata";
import {ConstraintMetadata} from "./ConstraintMetadata";
import {ValidationSchema} from "../validation-schema/ValidationSchema";
import {ValidationSchemaToMetadataTransformer} from "../validation-schema/ValidationSchemaToMetadataTransformer";

/**
 * Storage all metadatas.
 */
export class MetadataStorage {

    // -------------------------------------------------------------------------
    // Private properties
    // -------------------------------------------------------------------------

    private validationMetadatas: ValidationMetadata[] = [];
    private constraintMetadatas: ConstraintMetadata[] = [];

    get hasValidationMetaData() {
        return !!this.validationMetadatas.length;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Adds a new validation metadata.
     */
    addValidationSchema(schema: ValidationSchema) {
        const validationMetadatas = new ValidationSchemaToMetadataTransformer().transform(schema);
        validationMetadatas.forEach(validationMetadata => this.addValidationMetadata(validationMetadata));
    }
    
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
     * Groups metadata by their property names.
     */
    groupByPropertyName(metadata: ValidationMetadata[]): { [propertyName: string]: ValidationMetadata[] } {
        const grouped: { [propertyName: string]: ValidationMetadata[] } = {};
        metadata.forEach(metadata => {
            if (!grouped[metadata.propertyName])
                grouped[metadata.propertyName] = [];
            grouped[metadata.propertyName].push(metadata);
        });
        return grouped;
    }

    /**
     * Gets all validation metadatas for the given object with the given groups.
     */
    getTargetValidationMetadatas(targetConstructor: Function, targetSchema: string, groups?: string[]): ValidationMetadata[] {
        
        // get directly related to a target metadatas
        const originalMetadatas = this.validationMetadatas.filter(metadata => {
            if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
                return false;
            if (metadata.always) 
                return true;
            if (groups && groups.length > 0)
                return metadata.groups && !!metadata.groups.find(group => groups.indexOf(group) !== -1);
            
            return true;
        });
        
        // get metadatas for inherited classes
        const inheritedMetadatas = this.validationMetadatas.filter(metadata => {
            if (metadata.target === targetConstructor)
                return false;
            if (metadata.target instanceof Function &&
                !(targetConstructor.prototype instanceof (metadata.target as Function)))
                return false;
            if (metadata.always) 
                return true;
            if (groups && groups.length > 0)
                return metadata.groups && !!metadata.groups.find(group => groups.indexOf(group) !== -1);
            
            return true;
        });

        // filter out duplicate metadatas, prefer original metadatas instead of inherited metadatas
        const uniqueInheritedMetadatas = inheritedMetadatas.filter(inheritedMetadata => {
            return !originalMetadatas.find(originalMetadata => {
                return  originalMetadata.propertyName === inheritedMetadata.propertyName && 
                        originalMetadata.type === inheritedMetadata.type;
            });
        });

        return originalMetadatas.concat(uniqueInheritedMetadatas);
    }

    /**
     * Gets all validator constraints for the given object.
     */
    getTargetValidatorConstraints(target: Function): ConstraintMetadata[] {
        return this.constraintMetadatas.filter(metadata => metadata.target === target);
    }

}