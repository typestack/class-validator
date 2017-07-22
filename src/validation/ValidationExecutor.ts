import {Validator} from "./Validator";
import {ValidationError} from "./ValidationError";
import {ValidationMetadata} from "../metadata/ValidationMetadata";
import {MetadataStorage} from "../metadata/MetadataStorage";
import {getFromContainer} from "../container";
import {ValidatorOptions} from "./ValidatorOptions";
import {ValidationTypes} from "./ValidationTypes";
import {ConstraintMetadata} from "../metadata/ConstraintMetadata";
import {ValidationArguments} from "./ValidationArguments";
import {ValidationUtils} from "./ValidationUtils";

/**
 * Executes validation over given object.
 */
export class ValidationExecutor {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    awaitingPromises: Promise<any>[] = [];
    ignoreAsyncValidations: boolean = false;

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

    execute(object: Object, targetSchema: string, validationErrors: ValidationError[]) {
        const groups = this.validatorOptions ? this.validatorOptions.groups : undefined;
        const targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, targetSchema, groups);
        const groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);

        Object.keys(groupedMetadatas).forEach(propertyName => {
            const value = (object as any)[propertyName];
            const definedMetadatas = groupedMetadatas[propertyName].filter(metadata => metadata.type === ValidationTypes.IS_DEFINED);
            const metadatas = groupedMetadatas[propertyName].filter(metadata => metadata.type !== ValidationTypes.IS_DEFINED);
            const customValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.CUSTOM_VALIDATION);
            const nestedValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.NESTED_VALIDATION);
            const conditionalValidationMetadatas = metadatas.filter(metadata => metadata.type === ValidationTypes.CONDITIONAL_VALIDATION);

            const validationError = this.generateValidationError(object, value, propertyName);
            validationErrors.push(validationError);

            const canValidate = this.conditionalValidations(object, value, conditionalValidationMetadatas);
            if (!canValidate) {
                return;
            }

            // handle IS_DEFINED validation type the special way - it should work no matter skipMissingProperties is set or not
            this.defaultValidations(object, value, definedMetadatas, validationError.constraints);

            if ((value === null || value === undefined) && this.validatorOptions && this.validatorOptions.skipMissingProperties === true) {
                return;
            }

            this.defaultValidations(object, value, metadatas, validationError.constraints);
            this.customValidations(object, value, customValidationMetadatas, validationError.constraints);
            this.nestedValidations(value, nestedValidationMetadatas, validationError.children);
        });
    }

    stripEmptyErrors(errors: ValidationError[]) {
        return errors.filter(error => {
            if (error.children) {
                error.children = this.stripEmptyErrors(error.children);
            }

            if (Object.keys(error.constraints).length === 0) {
                if (error.children.length === 0) {
                    return false;
                } else {
                    delete error.constraints;
                }
            }

            return true;
        });
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private generateValidationError(object: Object, value: any, propertyName: string) {
        const validationError = new ValidationError();

        if (!this.validatorOptions ||
            !this.validatorOptions.validationError ||
            this.validatorOptions.validationError.target === undefined ||
            this.validatorOptions.validationError.target === true)
            validationError.target = object;

        if (!this.validatorOptions ||
            !this.validatorOptions.validationError ||
            this.validatorOptions.validationError.value === undefined ||
            this.validatorOptions.validationError.value === true)
            validationError.value = value;

        validationError.property = propertyName;
        validationError.children = [];
        validationError.constraints = {};

        return validationError;
    }

    private conditionalValidations(object: Object,
                                   value: any,
                                   metadatas: ValidationMetadata[]) {
        return metadatas
            .map(metadata => metadata.constraints[0](object, value))
            .reduce((resultA, resultB) => resultA && resultB, true);
    }

    private defaultValidations(object: Object,
                               value: any,
                               metadatas: ValidationMetadata[],
                               errorMap: { [key: string]: string }) {
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
                const [key, message] = this.createValidationError(object, value, metadata);
                errorMap[key] = message;
            });
    }

    private customValidations(object: Object,
                              value: any,
                              metadatas: ValidationMetadata[],
                              errorMap: { [key: string]: string }) {
        metadatas.forEach(metadata => {
            getFromContainer(MetadataStorage)
                .getTargetValidatorConstraints(metadata.constraintCls)
                .forEach(customConstraintMetadata => {
                    if (customConstraintMetadata.async && this.ignoreAsyncValidations)
                        return;

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
                                const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
                                errorMap[type] = message;
                            }
                        });
                        this.awaitingPromises.push(promise);
                    } else {
                        if (!validatedValue) {
                            const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
                            errorMap[type] = message;
                        }
                    }
                });
        });
    }

    private nestedValidations(value: any, metadatas: ValidationMetadata[], errors: ValidationError[]) {

        if (value === void 0) {
            return;
        }

        metadatas.forEach(metadata => {
            if (metadata.type !== ValidationTypes.NESTED_VALIDATION) return;
            const targetSchema = typeof metadata.target === "string" ? metadata.target as string : undefined;

            if (value instanceof Array) {
                value.forEach((subValue: any, index: number) => {
                    const validationError = this.generateValidationError(value, subValue, index.toString());
                    errors.push(validationError);

                    this.execute(subValue, targetSchema, validationError.children);
                });

            } else if (value instanceof Object) {
                this.execute(value, targetSchema, errors);

            } else {
                throw new Error("Only objects and arrays are supported to nested validation");
            }
        });
    }

    private createValidationError(object: Object,
                                  value: any,
                                  metadata: ValidationMetadata,
                                  customValidatorMetadata?: ConstraintMetadata): [string, string] {

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
                message = ValidationTypes.getMessage(type, metadata.each);
        }

        const messageString = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
        return [type, messageString];
    }

}
