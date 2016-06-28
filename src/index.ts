import {Validator} from "./validation/Validator";
import {ValidationError} from "./validation/ValidationError";
import {ValidatorOptions} from "./validation/ValidatorOptions";
import {ValidationSchema} from "./validation-schema/ValidationSchema";
import {MetadataStorage} from "./metadata/MetadataStorage";
import {ConstraintMetadata} from "./metadata/ConstraintMetadata";
import {ValidatorConstraintInterface} from "./validation/ValidatorConstraintInterface";
import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {ValidationMetadataArgs} from "./metadata/ValidationMetadataArgs";
import {ValidationTypes} from "./validation/ValidationTypes";

// -------------------------------------------------------------------------
// Global Container
// -------------------------------------------------------------------------

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
let container: { get<T>(someClass: { new (...args: any[]): T }|Function): T } = new (class {
    private instances: any[] = [];
    get<T>(someClass: { new (...args: any[]): T }): T {
        if (!this.instances[someClass as any])
            this.instances[someClass as any] = new someClass();

        return this.instances[<any>someClass];
    }
})();

/**
 * Sets container to be used by this library.
 *
 * @param iocContainer
 */
export function useContainer(iocContainer: { get(someClass: any): any }) {
    container = iocContainer;
}

/**
 * Gets the IOC container used by this library.
 */
export function getFromContainer<T>(someClass: { new (...args: any[]): T }|Function): T {
    return container.get<T>(someClass);
}

// -------------------------------------------------------------------------
// Export everything api users needs
// -------------------------------------------------------------------------

export * from "./decorator/decorators";
export * from "./decorator/ValidationOptions";
export * from "./validation/ValidatorConstraintInterface";
export * from "./validation/ValidationError";
export * from "./validation/ValidationTypeOptions";
export * from "./validation/ValidatorOptions";
export * from "./validation-schema/ValidationSchema";
export * from "./validation/Validator";

// -------------------------------------------------------------------------
// Shortcut methods for api users
// -------------------------------------------------------------------------

/**
 * Validates given object.
 */
export function validate(object: any, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    return getFromContainer(Validator).validate(object, validatorOptions);
}

/**
 * Validates given object by a given validation schema.
 */
export function validateBySchema(schemaName: string, object: any, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    return getFromContainer(Validator).validateBySchema(schemaName, object, validatorOptions);
}

/**
 * Registers a new validation schema.
 */
export function registerSchema(schema: ValidationSchema): void {
    getFromContainer(MetadataStorage).addValidationSchema(schema);
}

/**
 * Registers a custom validation decorator.
 */
export function registerDecorator(object: Object, propertyName: string, validationOptions: ValidatorOptions, constraints: any[], constraintCls: Function): void;
export function registerDecorator(object: Object, propertyName: string, validationOptions: ValidatorOptions, constraints: any[], validationName: string, callback: (value?: any) => boolean|Promise<boolean>): void;
export function registerDecorator(object: Object, propertyName: string, validationOptions: ValidatorOptions, constraints: any[], validationNameOrConstraintCls: string|Function, callback?: (value?: any) => boolean|Promise<boolean>): void {
    
    let constraintCls: Function;
    if (validationNameOrConstraintCls instanceof Function) {
        constraintCls = validationNameOrConstraintCls as Function;
    } else {
        constraintCls = class CustomConstraint implements ValidatorConstraintInterface {
            validate(value: any, validatingObject: Object): Promise<boolean>|boolean {
                return callback(value);
            }
        };
        getFromContainer(MetadataStorage).addConstraintMetadata(new ConstraintMetadata(constraintCls, validationNameOrConstraintCls as string));
    }

    const validationMetadataArgs: ValidationMetadataArgs = {
        type: ValidationTypes.CUSTOM_VALIDATION,
        target: object.constructor,
        propertyName: propertyName,
        validationOptions: validationOptions,
        constraintCls: constraintCls,
        value1: constraints[0] // temporary
    };
    getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
}