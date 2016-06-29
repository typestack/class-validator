import {Validator} from "./Validator";
import {ValidationError} from "./ValidationError";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {MetadataStorage} from "../metadata/MetadataStorage";
import {getFromContainer} from "../index";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationTypes} from "./ValidationTypes";
import {ValidatorConstraintInterface} from "./ValidatorConstraintInterface";
import {ConstraintMetadata} from "../metadata/ConstraintMetadata";
import {ValidationArguments} from "./ValidationArguments";

/**
 * Executes validation over given object.
 */
export class ValidationExecutor {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private errors: ValidationError[] = [];
    private awaitingPromises: Promise<any>[] = [];

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
    
    execute(object: Object, targetSchema?: string) {
        const groups = this.validatorOptions ? this.validatorOptions.groups : undefined;
        const targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, targetSchema, groups);
        const groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);

        Object.keys(groupedMetadatas).forEach(propertyName => {
            const value = (object as any)[propertyName];
            const isDefinedMetadatas = groupedMetadatas[propertyName].filter(metadata => metadata.type === ValidationTypes.IS_DEFINED);
            const metadatas = groupedMetadatas[propertyName].filter(metadata => metadata.type !== ValidationTypes.IS_DEFINED);
            const customValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.CUSTOM_VALIDATION);
            const nestedValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.NESTED_VALIDATION);
            
            // handle IS_DEFINED validation type the special way - it should work no matter skipMissingProperties is set or not
            this.defaultValidations(object, value, isDefinedMetadatas);
            
            if ((value === null || value === undefined) && this.validatorOptions && this.validatorOptions.skipMissingProperties === true)
                return;
            
            this.defaultValidations(object, value, metadatas);
            this.customValidations(object, value, customValidationMetadatas);
            this.nestedValidations(value, nestedValidationMetadatas);
        });

        return Promise.all(this.awaitingPromises).then(() => this.errors);
    }
    
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private defaultValidations(object: Object, value: any, metadatas: ValidationMetadata[]) {
        return metadatas
            .filter(metadata => {
                if (metadata.each) {
                    if (value instanceof Array) {
                        return !value.every((subValue: any) => this.validator.validateValueByMetadata(subValue, metadata));
                    }

                } else {
                    return !this.validator.validateValueByMetadata(value, metadata);
                }
            })
            .forEach(metadata => {
                this.errors.push(this.createValidationError(object, value, metadata));
            });
    }

    private customValidations(object: Object, value: any, metadatas: ValidationMetadata[]) {
        metadatas.forEach(metadata => {
            getFromContainer(MetadataStorage)
                .getTargetValidatorConstraints(metadata.constraintCls)
                .forEach(customConstraintMetadata => {

                    const validationArguments: ValidationArguments = {
                        targetName: object.constructor ? (object.constructor as any).name : undefined,
                        property: metadata.propertyName,
                        object: object,
                        value: value,
                        constraints: metadata.constraints
                    };
                    const validatedValue = customConstraintMetadata.instance.validate(value, validationArguments);
                    if (validatedValue instanceof Promise) {
                        const promise = validatedValue.then(isValid => {
                            if (!isValid) {
                                this.errors.push(this.createValidationError(object, value, metadata, customConstraintMetadata));
                            }
                        });
                        this.awaitingPromises.push(promise);
                    } else {
                        if (!validatedValue)
                            this.errors.push(this.createValidationError(object, value, metadata, customConstraintMetadata));
                    }
                });
        });
    }
    
    private nestedValidations(value: any, metadatas: ValidationMetadata[]) {
        metadatas.forEach(metadata => {
            if (metadata.type !== ValidationTypes.NESTED_VALIDATION) return;
            const targetSchema = typeof metadata.target === "string" ? metadata.target as string : undefined;

            if (value instanceof Array) {
                value.forEach((subValue: any) => this.awaitingPromises.push(this.execute(subValue, targetSchema)));

            } else if (value instanceof Object) {
                this.awaitingPromises.push(this.execute(value, targetSchema));

            } else {
                throw new Error("Only objects and arrays are supported to nested validation");
            }
        });
    }

    private createValidationError(object: Object,
                                  value: any,
                                  metadata: ValidationMetadata,
                                  customValidatorMetadata?: ConstraintMetadata): ValidationError {
        
        const targetName = object.constructor ? (object.constructor as any).name : undefined;
        const type = customValidatorMetadata && customValidatorMetadata.name ? customValidatorMetadata.name : metadata.type;
        const validationArguments: ValidationArguments = {
            targetName: targetName,
            property: metadata.propertyName,
            object: object,
            value: value,
            constraints: metadata.constraints
        };

        let message = metadata.message;
        if (!metadata.message && 
            (!this.validatorOptions || (this.validatorOptions && !this.validatorOptions.dismissDefaultMessages))) {
            if (customValidatorMetadata && customValidatorMetadata.instance.defaultMessage instanceof Function) {
                message = customValidatorMetadata.instance.defaultMessage(validationArguments);
            }

            if (!message)
                message = ValidationTypes.getMessage(type);
        }

        let messageString: string;
        if (message instanceof Function) {
            messageString = (message as (args: ValidationArguments) => string)(validationArguments);

        } else if (typeof message === "string") {
            messageString = message as string;
        }
        
        if (messageString && metadata.constraints instanceof Array) {
            metadata.constraints.forEach((constraint, index) => {
                messageString = messageString.replace(new RegExp(`\\$constraint${index + 1}`, "g"), constraint);
            });
        }

        if (messageString && value !== undefined && value !== null)
            messageString = messageString.replace(/\$value/g, value);
        if (messageString)
            messageString = messageString.replace(/\$property/g, metadata.propertyName);
        if (messageString)
            messageString = messageString.replace(/\$target/g, targetName);

        return {
            target: targetName,
            property: metadata.propertyName,
            type: type,
            message: messageString,
            value: value
        };
    }
    
}