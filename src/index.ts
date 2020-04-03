import {ValidationError} from "./validation/ValidationError";
import {ValidatorOptions} from "./validation/ValidatorOptions";
import {ValidationSchema} from "./validation-schema/ValidationSchema";
import {MetadataStorage} from "./metadata/MetadataStorage";
import {Validator} from "./validation/Validator";
import {getFromContainer} from "./container";

/**
 * Gets metadata storage.
 * Metadata storage follows the best practices and stores metadata in a global variable.
 */
export function getMetadataStorage(): MetadataStorage {
    if (!(global as any).classValidatorMetadataStorage)
        (global as any).classValidatorMetadataStorage = new MetadataStorage();

    return (global as any).classValidatorMetadataStorage;
}

// -------------------------------------------------------------------------
// Export everything api users needs
// -------------------------------------------------------------------------

export * from "./container";
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
export * from "./register-decorator";
export * from "./metadata/MetadataStorage";

// -------------------------------------------------------------------------
// Shortcut methods for api users
// -------------------------------------------------------------------------

/**
 * Validates given object.
 */
export function validate(object: Record<string, any>, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;

/**
 * Validates given object by a given validation schema.
 */
export function validate(schemaName: string, object: Record<string, any>, validatorOptions?: ValidatorOptions): Promise<ValidationError[]>;

/**
 * Validates given object by object's decorators or given validation schema.
 */
export function validate(schemaNameOrObject: Record<string, any>|string,
                         objectOrValidationOptions?: Record<string, any>|ValidatorOptions,
                         maybeValidatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    if (typeof schemaNameOrObject === "string") {
        return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions as Record<string, any>, maybeValidatorOptions);
    } else {
        return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions as ValidatorOptions);
    }
}

/**
 * Validates given object and reject on error.
 */
export function validateOrReject(object: Record<string, any>, validatorOptions?: ValidatorOptions): Promise<void>;

/**
 * Validates given object by a given validation schema and reject on error.
 */
export function validateOrReject(schemaName: string, object: Record<string, any>, validatorOptions?: ValidatorOptions): Promise<void>;

/**
 * Validates given object by object's decorators or given validation schema and reject on error.
 */
export function validateOrReject(schemaNameOrObject: Record<string, any>|string,
                         objectOrValidationOptions?: Record<string, any>|ValidatorOptions,
                         maybeValidatorOptions?: ValidatorOptions): Promise<void> {
    if (typeof schemaNameOrObject === "string") {
        return getFromContainer(Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions as Record<string, any>, maybeValidatorOptions);
    } else {
        return getFromContainer(Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions as ValidatorOptions);
    }
}

/**
 * Performs sync validation of the given object.
 * Note that this method completely ignores async validations.
 * If you want to properly perform validation you need to call validate method instead.
 */
export function validateSync(object: Record<string, any>, validatorOptions?: ValidatorOptions): ValidationError[];

/**
 * Validates given object by a given validation schema.
 * Note that this method completely ignores async validations.
 * If you want to properly perform validation you need to call validate method instead.
 */
export function validateSync(schemaName: string, object: Record<string, any>, validatorOptions?: ValidatorOptions): ValidationError[];

/**
 * Validates given object by object's decorators or given validation schema.
 * Note that this method completely ignores async validations.
 * If you want to properly perform validation you need to call validate method instead.
 */
export function validateSync(schemaNameOrObject: Record<string, any>|string,
                             objectOrValidationOptions?: Record<string, any>|ValidatorOptions,
                             maybeValidatorOptions?: ValidatorOptions): ValidationError[] {
    if (typeof schemaNameOrObject === "string") {
        return getFromContainer(Validator).validateSync(schemaNameOrObject, objectOrValidationOptions as Record<string, any>, maybeValidatorOptions);
    } else {
        return getFromContainer(Validator).validateSync(schemaNameOrObject, objectOrValidationOptions as ValidatorOptions);
    }
}

/**
 * Registers a new validation schema.
 */
export function registerSchema(schema: ValidationSchema): void {
    getMetadataStorage().addValidationSchema(schema);
}
