import {ValidationError} from "./validation/ValidationError";
import {ValidatorOptions} from "./validation/ValidatorOptions";
import {ValidationSchema} from "./validation-schema/ValidationSchema";
import {MetadataStorage} from "./metadata/MetadataStorage";
import {ConstraintMetadata} from "./metadata/ConstraintMetadata";
import {ValidatorConstraintInterface} from "./validation/ValidatorConstraintInterface";
import {ValidationMetadata} from "./metadata/ValidationMetadata";
import {ValidationMetadataArgs} from "./metadata/ValidationMetadataArgs";
import {ValidationTypes} from "./validation/ValidationTypes";
import {Validator} from "./validation/Validator";
import {ValidationArguments} from "./validation/ValidationArguments";

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
export * from "./validation/ValidationArguments";
export * from "./validation/ValidationTypes";
export * from "./validation/Validator";
export * from "./validation-schema/ValidationSchema";

// -------------------------------------------------------------------------
// Shortcut methods for api users
// -------------------------------------------------------------------------

/**
 * Validates given object.
 */
export function validate(object: Object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;

/**
 * Validates given object by a given validation schema.
 */
export function validate(schemaName: string, object: Object, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;

/**
 * Validates given object by object's decorators or given validation schema.
 */
export function validate(schemaNameOrObject: Object|string, objectOrValidationOptions?: Object|ValidatorOptions, maybeValidatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    if (typeof schemaNameOrObject === "string") {
        return getFromContainer(Validator).validate(schemaNameOrObject as string, objectOrValidationOptions as Object, maybeValidatorOptions);
    } else {
        return getFromContainer(Validator).validate(schemaNameOrObject as Object, objectOrValidationOptions as ValidatorOptions);
    }
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
export function registerDecorator(object: Object, propertyName: string, validationOptions: ValidatorOptions, constraints: any[], validationName: string, callback: (value?: any, validationArguments?: ValidationArguments) => boolean|Promise<boolean>): void;
export function registerDecorator(object: Object, propertyName: string, validationOptions: ValidatorOptions, constraints: any[], validationNameOrConstraintCls: string|Function, callback?: (value?: any, validationArguments?: ValidationArguments) => boolean|Promise<boolean>): void {
    
    let constraintCls: Function;
    if (validationNameOrConstraintCls instanceof Function) {
        constraintCls = validationNameOrConstraintCls as Function;
    } else {
        constraintCls = class CustomConstraint implements ValidatorConstraintInterface {
            validate(value: any, validationArguments?: ValidationArguments): Promise<boolean>|boolean {
                return callback(value, validationArguments);
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
        constraints: constraints
    };
    getFromContainer(MetadataStorage).addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
}