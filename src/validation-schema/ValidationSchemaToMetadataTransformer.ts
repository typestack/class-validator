import { ValidationSchema } from './ValidationSchema';
import { ValidationMetadata } from '../metadata/ValidationMetadata';
import { ValidationMetadataArgs } from '../metadata/ValidationMetadataArgs';
import { ValidationOptions } from '../decorator/ValidationOptions';

/**
 * Used to transform validation schemas to validation metadatas.
 */
export class ValidationSchemaToMetadataTransformer {
  transform(schema: ValidationSchema): ValidationMetadata[] {
    const metadatas: ValidationMetadata[] = [];
    Object.keys(schema.properties).forEach(property => {
      schema.properties[property].forEach(validation => {
        const validationOptions: ValidationOptions = {
          message: validation.message,
          groups: validation.groups,
          always: validation.always,
          each: validation.each,
        };
        const args: ValidationMetadataArgs = {
          name: validation.name,
          type: validation.type,
          target: schema.name,
          propertyName: property,
          constraints: validation.constraints,
          validationTypeOptions: validation.options,
          validationOptions: validationOptions,
        };
        metadatas.push(new ValidationMetadata(args));
      });
    });
    return metadatas;
  }
}
