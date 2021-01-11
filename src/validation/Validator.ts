import { ValidationError } from './ValidationError';
import { ValidatorOptions } from './ValidatorOptions';
import { ValidationExecutor } from './ValidationExecutor';
import { ValidationOptions } from '../decorator/ValidationOptions';

/**
 * Validator performs validation of the given object based on its metadata.
 */
export class Validator {
  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Performs validation of the given object based on decorators used in given object class.
   */
  validate(object: object, options?: ValidatorOptions): Promise<ValidationError[]>;

  /**
   * Performs validation of the given object based on validation schema.
   */
  validate(schemaName: string, object: object, options?: ValidatorOptions): Promise<ValidationError[]>;

  /**
   * Performs validation of the given object based on decorators or validation schema.
   */
  validate(
    objectOrSchemaName: object | string,
    objectOrValidationOptions: object | ValidationOptions,
    maybeValidatorOptions?: ValidatorOptions
  ): Promise<ValidationError[]> {
    return this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
  }

  /**
   * Performs validation of the given object based on decorators used in given object class and reject on error.
   */
  validateOrReject(object: object, options?: ValidatorOptions): Promise<void>;

  /**
   * Performs validation of the given object based on validation schema and reject on error.
   */
  validateOrReject(schemaName: string, object: object, options?: ValidatorOptions): Promise<void>;

  /**
   * Performs validation of the given object based on decorators or validation schema and reject on error.
   */
  async validateOrReject(
    objectOrSchemaName: object | string,
    objectOrValidationOptions: object | ValidationOptions,
    maybeValidatorOptions?: ValidatorOptions
  ): Promise<void> {
    const errors = await this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
    if (errors.length) return Promise.reject(errors);
  }

  /**
   * Performs validation of the given object based on decorators used in given object class.
   * NOTE: This method completely ignores all async validations.
   */
  validateSync(object: object, options?: ValidatorOptions): ValidationError[];

  /**
   * Performs validation of the given object based on validation schema.
   */
  validateSync(schemaName: string, object: object, options?: ValidatorOptions): ValidationError[];

  /**
   * Performs validation of the given object based on decorators or validation schema.
   */
  validateSync(
    objectOrSchemaName: object | string,
    objectOrValidationOptions: object | ValidationOptions,
    maybeValidatorOptions?: ValidatorOptions
  ): ValidationError[] {
    const object = typeof objectOrSchemaName === 'string' ? (objectOrValidationOptions as object) : objectOrSchemaName;
    const options =
      typeof objectOrSchemaName === 'string' ? maybeValidatorOptions : (objectOrValidationOptions as ValidationOptions);
    const schema = typeof objectOrSchemaName === 'string' ? objectOrSchemaName : undefined;

    const executor = new ValidationExecutor(this, options);
    executor.ignoreAsyncValidations = true;
    const validationErrors: ValidationError[] = [];
    executor.execute(object, schema, validationErrors);
    return executor.stripEmptyErrors(validationErrors);
  }

  // -------------------------------------------------------------------------
  // Private Properties
  // -------------------------------------------------------------------------
  /**
   * Performs validation of the given object based on decorators or validation schema.
   * Common method for `validateOrReject` and `validate` methods.
   */
  private coreValidate(
    objectOrSchemaName: object | string,
    objectOrValidationOptions: object | ValidationOptions,
    maybeValidatorOptions?: ValidatorOptions
  ): Promise<ValidationError[]> {
    const object = typeof objectOrSchemaName === 'string' ? (objectOrValidationOptions as object) : objectOrSchemaName;
    const options =
      typeof objectOrSchemaName === 'string' ? maybeValidatorOptions : (objectOrValidationOptions as ValidationOptions);
    const schema = typeof objectOrSchemaName === 'string' ? objectOrSchemaName : undefined;

    const executor = new ValidationExecutor(this, options);
    const validationErrors: ValidationError[] = [];
    executor.execute(object, schema, validationErrors);

    return Promise.all(executor.awaitingPromises).then(() => {
      return executor.stripEmptyErrors(validationErrors);
    });
  }
}
