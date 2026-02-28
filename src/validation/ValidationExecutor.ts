import { Validator } from './Validator';
import { ValidationError } from './ValidationError';
import { ValidationMetadata } from '../metadata/ValidationMetadata';
import { ValidatorOptions } from './ValidatorOptions';
import { ValidationTypes } from './ValidationTypes';
import { ConstraintMetadata } from '../metadata/ConstraintMetadata';
import { ValidationArguments } from './ValidationArguments';
import { ValidationUtils } from './ValidationUtils';
import { isPromise, convertToArray } from '../utils';
import { getMetadataStorage, PartitionedPropertyMetadata } from '../metadata/MetadataStorage';

/** Checks if an object has any own enumerable properties without allocating an array. */
function hasConstraints(constraints: Record<string, string> | undefined): boolean {
  if (!constraints) return false;
  for (const _ in constraints) return true;
  return false;
}

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

  private metadataStorage = getMetadataStorage();
  private readonly skipUndefined: boolean;
  private readonly skipNull: boolean;
  private readonly skipMissing: boolean;
  private readonly includeTarget: boolean;
  private readonly includeValue: boolean;
  private readonly stopAtFirstError: boolean;
  private readonly dismissDefaultMessages: boolean;
  private readonly groups: string[] | undefined;
  private readonly strictGroups: boolean;
  private readonly always: boolean;
  private readonly forbidUnknownValues: boolean;
  private readonly whitelist: boolean;
  private readonly forbidNonWhitelisted: boolean;
  private currentTargetName: string | undefined;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(private validator: Validator, private validatorOptions?: ValidatorOptions) {
    this.skipUndefined = (validatorOptions && validatorOptions.skipUndefinedProperties === true) || false;
    this.skipNull = (validatorOptions && validatorOptions.skipNullProperties === true) || false;
    this.skipMissing = (validatorOptions && validatorOptions.skipMissingProperties === true) || false;
    this.includeTarget =
      !validatorOptions ||
      !validatorOptions.validationError ||
      validatorOptions.validationError.target === undefined ||
      validatorOptions.validationError.target === true;
    this.includeValue =
      !validatorOptions ||
      !validatorOptions.validationError ||
      validatorOptions.validationError.value === undefined ||
      validatorOptions.validationError.value === true;
    this.stopAtFirstError = (validatorOptions && validatorOptions.stopAtFirstError) || false;
    this.dismissDefaultMessages = (validatorOptions && validatorOptions.dismissDefaultMessages) || false;
    this.groups = validatorOptions ? validatorOptions.groups : undefined;
    this.strictGroups = (validatorOptions && validatorOptions.strictGroups) || false;
    this.always = (validatorOptions && validatorOptions.always) || false;
    this.forbidUnknownValues =
      !validatorOptions ||
      validatorOptions.forbidUnknownValues === undefined ||
      validatorOptions.forbidUnknownValues !== false;
    this.whitelist = (validatorOptions && validatorOptions.whitelist) || false;
    this.forbidNonWhitelisted = (validatorOptions && validatorOptions.forbidNonWhitelisted) || false;
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  execute(object: object, targetSchema: string, validationErrors: ValidationError[]): void {
    /**
     * If there is no metadata registered it means possibly the dependencies are not flatterned and
     * more than one instance is used.
     *
     * TODO: This needs proper handling, forcing to use the same container or some other proper solution.
     */
    if (!this.metadataStorage.hasValidationMetaData && this.validatorOptions?.enableDebugMessages === true) {
      console.warn(
        `No validation metadata found. No validation will be  performed. There are multiple possible reasons:\n` +
          `  - There may be multiple class-validator versions installed. You will need to flatten your dependencies to fix the issue.\n` +
          `  - This validation runs before any file with validation decorator was parsed by NodeJS.`
      );
    }

    const cacheKey = this.metadataStorage.buildCacheKey(
      object.constructor,
      targetSchema,
      this.always,
      this.strictGroups,
      this.groups
    );
    const targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(
      object.constructor,
      targetSchema,
      this.always,
      this.strictGroups,
      this.groups,
      cacheKey
    );
    const groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas, cacheKey);

    if (this.forbidUnknownValues && !targetMetadatas.length) {
      const validationError = new ValidationError();

      if (this.includeTarget) validationError.target = object;

      validationError.value = undefined;
      validationError.property = undefined;
      validationError.children = [];
      validationError.constraints = { unknownValue: 'an unknown value was passed to the validate function' };

      validationErrors.push(validationError);

      return;
    }

    if (this.whitelist) this.whitelistValidation(object, groupedMetadatas, validationErrors);

    // General validation
    this.currentTargetName = object.constructor ? (object.constructor as any).name : undefined;
    const partitioned = this.metadataStorage.getPartitionedMetadata(groupedMetadatas, cacheKey);
    for (const propertyName in partitioned) {
      const value = (object as any)[propertyName];
      const partition = partitioned[propertyName];

      if (partition.hasPromiseValidation && value instanceof Promise) {
        this.awaitingPromises.push(
          value.then(resolvedValue => {
            this.performValidations(object, resolvedValue, propertyName, partition, validationErrors);
          })
        );
      } else {
        this.performValidations(object, value, propertyName, partition, validationErrors);
      }
    }
  }

  whitelistValidation(
    object: any,
    groupedMetadatas: { [propertyName: string]: ValidationMetadata[] },
    validationErrors: ValidationError[]
  ): void {
    const notAllowedProperties: string[] = [];

    for (const propertyName in object) {
      if (!groupedMetadatas[propertyName] || groupedMetadatas[propertyName].length === 0)
        notAllowedProperties.push(propertyName);
    }

    if (notAllowedProperties.length > 0) {
      if (this.forbidNonWhitelisted) {
        // throw errors
        notAllowedProperties.forEach(property => {
          const validationError: ValidationError = this.generateValidationError(object, object[property], property);
          validationError.constraints = { [ValidationTypes.WHITELIST]: `property ${property} should not exist` };
          validationError.children = undefined;
          validationErrors.push(validationError);
        });
      } else {
        // strip non allowed properties
        notAllowedProperties.forEach(property => delete object[property]);
      }
    }
  }

  stripEmptyErrors(errors: ValidationError[]): ValidationError[] {
    return errors.filter(error => {
      if (error.children) {
        error.children = this.stripEmptyErrors(error.children);
      }

      if (!hasConstraints(error.constraints)) {
        if (error.children?.length === 0) {
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

  private performValidations(
    object: any,
    value: any,
    propertyName: string,
    partition: PartitionedPropertyMetadata,
    validationErrors: ValidationError[]
  ): void {
    // Fast path: most properties have only custom validators with no conditionals/defined/nested
    if (partition.customOnly) {
      const metadatas = partition.custom;
      const validationArguments: ValidationArguments = {
        targetName: this.currentTargetName,
        property: propertyName,
        object: object,
        value: value,
        constraints: undefined as any,
      };

      let validationError: ValidationError | undefined;
      const asyncCountBefore = this.awaitingPromises.length;

      for (const metadata of metadatas) {
        validationArguments.constraints = metadata.constraints;

        if (
          metadata.inlineValidate &&
          (!metadata.each || !(Array.isArray(value) || value instanceof Set || value instanceof Map))
        ) {
          if (this.stopAtFirstError && validationError && hasConstraints(validationError.constraints)) continue;

          const validatedValue = metadata.inlineValidate(value, validationArguments);
          if (validatedValue !== true && validatedValue !== false) {
            const promise = validatedValue.then(isValid => {
              if (!isValid) {
                if (!validationError) validationError = this.generateValidationError(object, value, propertyName);
                const [type, message] = this.createValidationErrorInline(metadata, validationArguments);
                validationError.constraints[type] = message;
                if (metadata.context) {
                  if (!validationError.contexts) validationError.contexts = {};
                  validationError.contexts[type] = Object.assign(
                    validationError.contexts[type] || {},
                    metadata.context
                  );
                }
              }
            });
            this.awaitingPromises.push(promise);
          } else if (!validatedValue) {
            if (!validationError) validationError = this.generateValidationError(object, value, propertyName);
            const [type, message] = this.createValidationErrorInline(metadata, validationArguments);
            validationError.constraints[type] = message;
            if (metadata.context) {
              if (!validationError.contexts) validationError.contexts = {};
              validationError.contexts[type] = Object.assign(validationError.contexts[type] || {}, metadata.context);
            }
          }
          continue;
        }

        // Fallback for non-inline validators (user-defined class validators, each validators)
        const getError = (): ValidationError => {
          if (!validationError) validationError = this.generateValidationError(object, value, propertyName);
          return validationError;
        };
        this.customValidations(object, value, [metadata], getError);
      }

      if (validationError) {
        const hasAsyncPending = this.awaitingPromises.length > asyncCountBefore;
        if (
          hasConstraints(validationError.constraints) ||
          (validationError.children && validationError.children.length > 0) ||
          hasAsyncPending
        ) {
          validationErrors.push(validationError);
        }
      } else if (this.awaitingPromises.length > asyncCountBefore) {
        validationError = this.generateValidationError(object, value, propertyName);
        validationErrors.push(validationError);
      }
      return;
    }

    const canValidate = this.conditionalValidations(object, value, partition.conditional);
    if (!canValidate) {
      return;
    }

    // Lazily create error — only allocate when something needs it
    let validationError: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!validationError) {
        validationError = this.generateValidationError(object, value, propertyName);
      }
      return validationError;
    };

    const asyncCountBefore = this.awaitingPromises.length;

    // handle IS_DEFINED validation type the special way - it should work no matter skipUndefinedProperties/skipMissingProperties is set or not
    if (partition.defined.length > 0) {
      this.customValidations(object, value, partition.defined, getError);
      if (validationError) this.mapContexts(object, value, partition.defined, validationError);
    }

    if (value === undefined && this.skipUndefined) {
      if (validationError) this.pushErrorIfNeeded(validationError, asyncCountBefore, validationErrors);
      return;
    }

    if (value === null && this.skipNull) {
      if (validationError) this.pushErrorIfNeeded(validationError, asyncCountBefore, validationErrors);
      return;
    }

    if ((value === null || value === undefined) && this.skipMissing) {
      if (validationError) this.pushErrorIfNeeded(validationError, asyncCountBefore, validationErrors);
      return;
    }

    if (partition.custom.length > 0) {
      this.customValidations(object, value, partition.custom, getError);
    }

    if (partition.nested.length > 0) {
      this.nestedValidations(value, partition.nested, getError());
    }

    // If async validators were added, we must eagerly create and push the error
    // since async callbacks will write to it after this method returns
    const hasAsyncPending = this.awaitingPromises.length > asyncCountBefore;
    if (hasAsyncPending && !validationError) {
      validationError = getError();
    }

    if (partition.all.length > 0 && validationError) {
      this.mapContexts(object, value, partition.all, validationError);
    }

    if (validationError) {
      this.pushErrorIfNeeded(validationError, asyncCountBefore, validationErrors);
    }
  }

  private pushErrorIfNeeded(
    error: ValidationError,
    asyncCountBefore: number,
    validationErrors: ValidationError[]
  ): void {
    const hasChildren = error.children && error.children.length > 0;
    const hasAsyncPending = this.awaitingPromises.length > asyncCountBefore;

    if (hasConstraints(error.constraints) || hasChildren || hasAsyncPending) {
      validationErrors.push(error);
    }
  }

  private generateValidationError(object: object, value: any, propertyName: string): ValidationError {
    const validationError = new ValidationError();

    if (this.includeTarget) validationError.target = object;
    if (this.includeValue) validationError.value = value;

    validationError.property = propertyName;
    validationError.children = [];
    validationError.constraints = {};

    return validationError;
  }

  private conditionalValidations(object: object, value: any, metadatas: ValidationMetadata[]): boolean {
    for (const metadata of metadatas) {
      if (!metadata.constraints[0](object, value)) return false;
    }
    return true;
  }

  private customValidations(
    object: object,
    value: any,
    metadatas: ValidationMetadata[],
    getError: () => ValidationError
  ): void {
    if (metadatas.length === 0) return;

    const validationArguments: ValidationArguments = {
      targetName: this.currentTargetName,
      property: metadatas[0].propertyName,
      object: object,
      value: value,
      constraints: undefined as any,
    };

    for (const metadata of metadatas) {
      validationArguments.constraints = metadata.constraints;
      if (metadata.validateIf && !metadata.validateIf(object, value)) continue;

      // Fast path: inline validators (all built-in decorators) bypass constraint metadata dispatch
      if (
        metadata.inlineValidate &&
        (!metadata.each || !(Array.isArray(value) || value instanceof Set || value instanceof Map))
      ) {
        if (this.stopAtFirstError) {
          const error = getError();
          if (hasConstraints(error.constraints)) continue;
        }

        const validatedValue = metadata.inlineValidate(value, validationArguments);
        if (validatedValue !== true && validatedValue !== false) {
          // Async result (Promise)
          const promise = validatedValue.then(isValid => {
            if (!isValid) {
              const error = getError();
              const [type, message] = this.createValidationErrorInline(metadata, validationArguments);
              error.constraints[type] = message;
              if (metadata.context) {
                if (!error.contexts) {
                  error.contexts = {};
                }
                error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
              }
            }
          });
          this.awaitingPromises.push(promise);
        } else if (!validatedValue) {
          const error = getError();
          const [type, message] = this.createValidationErrorInline(metadata, validationArguments);
          error.constraints[type] = message;
          if (metadata.context) {
            if (!error.contexts) {
              error.contexts = {};
            }
            error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
          }
        }
        continue;
      }

      const constraintMetadatas =
        metadata.resolvedConstraints ??
        (metadata.resolvedConstraints = this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls));
      for (const customConstraintMetadata of constraintMetadatas) {
        if (customConstraintMetadata.async && this.ignoreAsyncValidations) continue;
        if (this.stopAtFirstError) {
          const error = getError();
          if (hasConstraints(error.constraints)) continue;
        }

        if (!metadata.each || !(Array.isArray(value) || value instanceof Set || value instanceof Map)) {
          const validatedValue = customConstraintMetadata.instance.validate(value, validationArguments);
          if (isPromise(validatedValue)) {
            const promise = validatedValue.then(isValid => {
              if (!isValid) {
                const error = getError();
                const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
                error.constraints[type] = message;
                if (metadata.context) {
                  if (!error.contexts) {
                    error.contexts = {};
                  }
                  error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
                }
              }
            });
            this.awaitingPromises.push(promise);
          } else {
            if (!validatedValue) {
              const error = getError();
              const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
              error.constraints[type] = message;
            }
          }

          continue;
        }

        // convert set and map into array
        const arrayValue = convertToArray(value);
        // Validation needs to be applied to each array item
        const validatedSubValues = arrayValue.map((subValue: any) =>
          customConstraintMetadata.instance.validate(subValue, validationArguments)
        );
        const validationIsAsync = validatedSubValues.some((validatedSubValue: boolean | Promise<boolean>) =>
          isPromise(validatedSubValue)
        );

        if (validationIsAsync) {
          // Wrap plain values (if any) in promises, so that all are async
          const asyncValidatedSubValues = validatedSubValues.map((validatedSubValue: boolean | Promise<boolean>) =>
            isPromise(validatedSubValue) ? validatedSubValue : Promise.resolve(validatedSubValue)
          );
          const asyncValidationIsFinishedPromise = Promise.all(asyncValidatedSubValues).then(
            (flatValidatedValues: boolean[]) => {
              const validationResult = flatValidatedValues.every((isValid: boolean) => isValid);
              if (!validationResult) {
                const error = getError();
                const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
                error.constraints[type] = message;
                if (metadata.context) {
                  if (!error.contexts) {
                    error.contexts = {};
                  }
                  error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
                }
              }
            }
          );

          this.awaitingPromises.push(asyncValidationIsFinishedPromise);

          continue;
        }

        const validationResult = validatedSubValues.every((isValid: boolean) => isValid);
        if (!validationResult) {
          const error = getError();
          const [type, message] = this.createValidationError(object, value, metadata, customConstraintMetadata);
          error.constraints[type] = message;
        }
      }
    }
  }

  private nestedValidations(value: any, metadatas: ValidationMetadata[], error: ValidationError): void {
    if (value === void 0) {
      return;
    }

    for (const metadata of metadatas) {
      if (metadata.type !== ValidationTypes.NESTED_VALIDATION && metadata.type !== ValidationTypes.PROMISE_VALIDATION) {
        continue;
      } else if (this.stopAtFirstError && Object.keys(error.constraints || {}).length > 0) {
        continue;
      }

      if (Array.isArray(value) || value instanceof Set || value instanceof Map) {
        // Treats Set as an array - as index of Set value is value itself and it is common case to have Object as value
        const arrayLikeValue = value instanceof Set ? Array.from(value) : value;
        const arrayPartition: PartitionedPropertyMetadata = {
          defined: [],
          custom: [],
          nested: metadatas,
          conditional: [],
          all: metadatas,
          hasPromiseValidation: false,
          customOnly: false,
        };
        arrayLikeValue.forEach((subValue: any, index: any) => {
          this.performValidations(value, subValue, index.toString(), arrayPartition, error.children);
        });
      } else if (value instanceof Object) {
        const targetSchema = typeof metadata.target === 'string' ? metadata.target : metadata.target.name;
        this.execute(value, targetSchema, error.children);
      } else {
        const [type, message] = this.createValidationError(metadata.target as object, value, metadata);
        error.constraints[type] = message;
      }
    }
  }

  private mapContexts(object: object, value: any, metadatas: ValidationMetadata[], error: ValidationError): void {
    for (const metadata of metadatas) {
      if (metadata.context) {
        let type: string;
        if (metadata.type === ValidationTypes.CUSTOM_VALIDATION) {
          if (metadata.inlineValidate) {
            // Inline validators: use metadata.name directly
            type = metadata.name || metadata.type;
          } else {
            const customConstraints =
              metadata.resolvedConstraints ??
              (metadata.resolvedConstraints = this.metadataStorage.getTargetValidatorConstraints(
                metadata.constraintCls
              ));
            type = customConstraints[0] && customConstraints[0].name ? customConstraints[0].name : metadata.type;
          }
        } else {
          type = metadata.type;
        }

        if (error.constraints[type]) {
          if (!error.contexts) {
            error.contexts = {};
          }

          error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
        }
      }
    }
  }

  private createValidationError(
    object: object,
    value: any,
    metadata: ValidationMetadata,
    customValidatorMetadata?: ConstraintMetadata
  ): [string, string] {
    const type = this.getConstraintType(metadata, customValidatorMetadata);
    const validationArguments: ValidationArguments = {
      targetName: this.currentTargetName,
      property: metadata.propertyName,
      object: object,
      value: value,
      constraints: metadata.constraints,
    };

    let message = metadata.message || '';
    if (!metadata.message && !this.dismissDefaultMessages) {
      if (customValidatorMetadata && customValidatorMetadata.instance.defaultMessage instanceof Function) {
        message = customValidatorMetadata.instance.defaultMessage(validationArguments);
      }
    }

    const messageString = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
    return [type, messageString];
  }

  private createValidationErrorInline(
    metadata: ValidationMetadata,
    validationArguments: ValidationArguments
  ): [string, string] {
    const type = metadata.name || metadata.type;
    let message = metadata.message || '';
    if (!metadata.message && !this.dismissDefaultMessages) {
      if (metadata.inlineDefaultMessage) {
        message = metadata.inlineDefaultMessage(validationArguments);
      }
    }

    const messageString = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
    return [type, messageString];
  }

  private getConstraintType(metadata: ValidationMetadata, customValidatorMetadata?: ConstraintMetadata): string {
    const type = customValidatorMetadata && customValidatorMetadata.name ? customValidatorMetadata.name : metadata.type;
    return type;
  }
}
