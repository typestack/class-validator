import {Validator} from "./Validator";
import {ValidationError} from "./ValidationError";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {MetadataStorage} from "../metadata/MetadataStorage";
import {getFromContainer} from "../index";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationTypes} from "./ValidationTypes";

export class ValidationExecutor {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private errors: ValidationError[] = [];
    private awaitingPromises: Promise<any>[];

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private metadataStorage = getFromContainer(MetadataStorage);
    
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private validator: Validator, 
                private validatorOptions?: ValidatorOptions) {
    }
    
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    
    execute(object: Object) {
        const groups = this.validatorOptions ? this.validatorOptions.groups : undefined;
        const targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, groups);
        const groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);

        Object.keys(groupedMetadatas).forEach(propertyName => {
            const value = (object as any)[propertyName];
            if (!value && this.validatorOptions && this.validatorOptions.skipMissingProperties === true)
                return;

            const metadatas = groupedMetadatas[propertyName];
            const customValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.CUSTOM_VALIDATION);
            const nestedValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.NESTED_VALIDATION);

            this.defaultValidations(value, metadatas);
            this.customValidations(value, customValidationMetadatas);
            this.nestedValidations(value, nestedValidationMetadatas);
        });

        return Promise.all(this.awaitingPromises).then(() => this.errors);
    }
    
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    
    private nestedValidations(value: any, metadatas: ValidationMetadata[]) {
        metadatas.forEach(metadata => {
            if (metadata.type !== ValidationTypes.NESTED_VALIDATION) return;

            if (value instanceof Array) {
                value.forEach((subValue: any) => this.awaitingPromises.push(this.execute(subValue)));

            } else if (value instanceof Object) {
                this.awaitingPromises.push(this.execute(value));

            } else {
                throw new Error("Only objects and arrays are supported to nested validation");
            }
        });
    }
    
    private customValidations(value: any, metadatas: ValidationMetadata[]) {
        metadatas.forEach(metadata => {
            this.metadataStorage
                .getTargetValidatorConstraints(metadata.value1 as Function)
                .forEach(customConstraintMetadata => {
                    const validatedValue = customConstraintMetadata.instance.validate(value);
                    if (validatedValue instanceof Promise) {
                        const promise = validatedValue.then(isValid => {
                            if (!isValid) {
                                this.errors.push(this.createValidationError(value, metadata));
                            }
                        });
                        this.awaitingPromises.push(promise);
                    } else {
                        if (!validatedValue)
                            this.errors.push(this.createValidationError(value, metadata));
                    }
                });
        });
    }
    
    private defaultValidations(value: any, metadatas: ValidationMetadata[]) {
        return metadatas
            .filter(metadata => {
                if (metadata.each) {
                    if (value instanceof Array) {
                        return value.every((subValue: any) => this.validator.validateBasedOnMetadata(subValue, metadata));
                    } else {
                        throw new Error(`Cannot validate ${(metadata.target as any).name}#${metadata.propertyName} because supplied value is not an array, however array is expected for validation.`);
                    }
    
                } else {
                    return this.validator.validateBasedOnMetadata(value, metadata);
                }
            })
            .forEach(metadata => {
                this.errors.push(this.createValidationError(value, metadata));
            });
    }

    private createValidationError(value: any, metadata: ValidationMetadata): ValidationError {
        return {
            property: metadata.propertyName,
            type: metadata.type,
            message: metadata.message,
            value: value
        };
    }
    
}