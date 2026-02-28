import { ValidationMetadata } from '../../src/metadata/ValidationMetadata';
import { ValidationExecutor } from '../../src/validation/ValidationExecutor';
import { ValidationTypes } from '../../src/validation/ValidationTypes';
import { Validator } from '../../src/validation/Validator';
import { ValidationError } from '../../src/validation/ValidationError';

describe('ValidationExecutor PR-2665 coverage', () => {
  class TestTarget {
    prop: any;
  }

  function inlineMetadata(name: string, validateFn: (value: any) => boolean | Promise<boolean>): ValidationMetadata {
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name,
    });
    metadata.inlineValidate = validateFn;
    metadata.constraints = [];
    metadata.message = `${name} failed`;
    return metadata;
  }

  it('should validate custom and nested metadata when partition is not customOnly', () => {
    const executor = new ValidationExecutor(new Validator());
    const custom = inlineMetadata('inlineFalse', () => false);
    const nested = new ValidationMetadata({
      type: ValidationTypes.NESTED_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
    });
    const object = { prop: 1 };
    const errors: ValidationError[] = [];

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).performValidations(
      object,
      object.prop,
      'prop',
      {
        defined: [],
        custom: [custom],
        nested: [nested],
        conditional: [],
        all: [custom, nested],
        hasPromiseValidation: false,
        customOnly: false,
      },
      errors
    );

    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toHaveProperty('inlineFalse');
    expect(errors[0].constraints).toHaveProperty(ValidationTypes.NESTED_VALIDATION);
  });

  it('should short-circuit inline validators when stopAtFirstError is enabled in fallback custom path', () => {
    const executor = new ValidationExecutor(new Validator(), { stopAtFirstError: true });
    const first = inlineMetadata('firstInline', () => false);
    const second = inlineMetadata('secondInline', () => false);
    const object = { prop: 'x' };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) {
        error = (executor as any).generateValidationError(object, object.prop, 'prop');
      }
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [first, second], getError);

    expect(error).toBeDefined();
    expect(Object.keys(error.constraints)).toEqual(['firstInline']);
  });

  it('should handle async and sync custom constraint failures in fallback custom path', () => {
    const metadataAsync = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class AsyncConstraint {},
    });
    metadataAsync.constraints = [];

    const metadataSync = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class SyncConstraint {},
    });
    metadataSync.constraints = [];

    const asyncExecutor = new ValidationExecutor(new Validator());
    (asyncExecutor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [
        {
          name: 'asyncConstraint',
          async: true,
          instance: {
            validate: () => Promise.resolve(false),
            defaultMessage: () => 'async failed',
          },
        },
      ],
    };

    const asyncObject = { prop: 'x' };
    let asyncError: ValidationError | undefined;
    const getAsyncError = (): ValidationError => {
      if (!asyncError) {
        asyncError = (asyncExecutor as any).generateValidationError(asyncObject, asyncObject.prop, 'prop');
      }
      return asyncError;
    };
    (asyncExecutor as any).currentTargetName = 'TestTarget';
    (asyncExecutor as any).customValidations(asyncObject, asyncObject.prop, [metadataAsync], getAsyncError);

    const syncExecutor = new ValidationExecutor(new Validator());
    (syncExecutor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [
        {
          name: 'syncConstraint',
          async: false,
          instance: {
            validate: () => false,
            defaultMessage: () => 'sync failed',
          },
        },
      ],
    };

    const syncObject = { prop: 'x' };
    let syncError: ValidationError | undefined;
    const getSyncError = (): ValidationError => {
      if (!syncError) {
        syncError = (syncExecutor as any).generateValidationError(syncObject, syncObject.prop, 'prop');
      }
      return syncError;
    };
    (syncExecutor as any).currentTargetName = 'TestTarget';
    (syncExecutor as any).customValidations(syncObject, syncObject.prop, [metadataSync], getSyncError);

    return Promise.all((asyncExecutor as any).awaitingPromises).then(() => {
      expect(asyncError).toBeDefined();
      expect(asyncError.constraints).toHaveProperty('asyncConstraint');
      expect(syncError).toBeDefined();
      expect(syncError.constraints).toHaveProperty('syncConstraint');
    });
  });

  it('should eagerly create and push an error when async validation is pending without immediate failures', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class AsyncPassConstraint {},
    });
    metadata.constraints = [];
    (executor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [
        {
          name: 'asyncPassConstraint',
          async: true,
          instance: {
            validate: () => Promise.resolve(true),
            defaultMessage: () => 'unused',
          },
        },
      ],
    };

    const object = { prop: 'x' };
    const errors: ValidationError[] = [];
    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).performValidations(
      object,
      object.prop,
      'prop',
      {
        defined: [],
        custom: [metadata],
        nested: [],
        conditional: [],
        all: [metadata],
        hasPromiseValidation: false,
        customOnly: false,
      },
      errors
    );

    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toEqual({});

    return Promise.all((executor as any).awaitingPromises).then(() => {
      expect(errors[0].constraints).toEqual({});
    });
  });

  it('should apply each custom validation by converting Set values to array', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class EachConstraint {},
    });
    metadata.constraints = [];
    metadata.each = true;
    (executor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [
        {
          name: 'eachConstraint',
          async: false,
          instance: {
            validate: (value: string) => value === 'ok',
            defaultMessage: () => 'each failed',
          },
        },
      ],
    };

    const object = { prop: new Set(['ok', 'bad']) };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) {
        error = (executor as any).generateValidationError(object, object.prop, 'prop');
      }
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [metadata], getError);

    expect(error).toBeDefined();
    expect(error.constraints).toHaveProperty('eachConstraint');
  });

  it('should log a warning when enableDebugMessages is true and no validation metadata exists', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const executor = new ValidationExecutor(new Validator(), {
      enableDebugMessages: true,
      forbidUnknownValues: false,
    });
    (executor as any).metadataStorage = {
      hasValidationMetaData: false,
      buildCacheKey: () => 'debugKey',
      getTargetValidationMetadatas: () => [],
      groupByPropertyName: () => ({}),
      getPartitionedMetadata: () => ({}),
    };

    executor.execute(new TestTarget(), 'TestTarget', []);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No validation metadata found'));
    warnSpy.mockRestore();
  });

  it('should not include value in generated errors when validationError.value is false', () => {
    const executor = new ValidationExecutor(new Validator(), {
      validationError: { value: false },
    });

    const error = (executor as any).generateValidationError({}, 'hidden', 'prop');

    expect(error.value).toBeUndefined();
  });

  it('should not log a warning when debug messages are disabled and no metadata exists', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const executor = new ValidationExecutor(new Validator());
    (executor as any).metadataStorage = {
      hasValidationMetaData: false,
      buildCacheKey: () => 'debugKey',
      getTargetValidationMetadatas: () => [
        new ValidationMetadata({
          type: ValidationTypes.CUSTOM_VALIDATION,
          target: TestTarget,
          propertyName: 'prop',
        }),
      ],
      groupByPropertyName: () => ({}),
      getPartitionedMetadata: () => ({}),
    };

    executor.execute(new TestTarget(), 'TestTarget', []);

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should handle objects without a truthy constructor name during execute', () => {
    const executor = new ValidationExecutor(new Validator(), { forbidUnknownValues: false });
    const object = { constructor: undefined as any, prop: 'x' };
    const performSpy = jest.spyOn(executor as any, 'performValidations').mockImplementation(() => {});
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'noCtor',
    });

    (executor as any).metadataStorage = {
      hasValidationMetaData: true,
      buildCacheKey: () => 'no-ctor',
      getTargetValidationMetadatas: () => [metadata],
      groupByPropertyName: () => ({ prop: [metadata] }),
      getPartitionedMetadata: () => ({
        prop: {
          defined: [],
          custom: [metadata],
          nested: [],
          conditional: [],
          all: [metadata],
          hasPromiseValidation: false,
          customOnly: false,
        },
      }),
    };

    executor.execute(object as any, 'TestTarget', []);

    expect((executor as any).currentTargetName).toBeUndefined();
    expect(performSpy).toHaveBeenCalled();
    performSpy.mockRestore();
  });

  it('should keep errors without constraints when children is undefined in stripEmptyErrors', () => {
    const executor = new ValidationExecutor(new Validator());
    const errors = [
      {
        target: {},
        property: 'prop',
        value: 'x',
      } as ValidationError,
    ];

    expect(executor.stripEmptyErrors(errors)).toEqual(errors);
  });

  it('should handle async inline validation failure with context in customValidations', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'asyncInline',
    });
    metadata.inlineValidate = () => Promise.resolve(false);
    metadata.constraints = [];
    metadata.context = { key: 'asyncCtx' };

    const object = { prop: 'x' };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) error = (executor as any).generateValidationError(object, object.prop, 'prop');
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [metadata], getError);

    return Promise.all((executor as any).awaitingPromises).then(() => {
      expect(error).toBeDefined();
      expect(error.constraints).toHaveProperty('asyncInline');
      expect(error.contexts).toEqual({ asyncInline: { key: 'asyncCtx' } });
    });
  });

  it('should create an error when async inline validation fails in the customOnly fast path', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'asyncInlineFastPath',
    });
    metadata.inlineValidate = () => Promise.resolve(false);
    metadata.constraints = [];

    const object = { prop: 'x' };
    const errors: ValidationError[] = [];

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).performValidations(
      object,
      object.prop,
      'prop',
      {
        defined: [],
        custom: [metadata],
        nested: [],
        conditional: [],
        all: [metadata],
        hasPromiseValidation: false,
        customOnly: true,
      },
      errors
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({});

    return Promise.all((executor as any).awaitingPromises).then(() => {
      expect(errors[0].constraints).toHaveProperty('asyncInlineFastPath');
    });
  });

  it('should create the fast-path validation error inside a synchronous thenable callback', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'syncThenableInline',
    });
    metadata.inlineValidate = () =>
      ({
        then(resolve: (isValid: boolean) => void) {
          resolve(false);
          return Promise.resolve();
        },
      } as any);
    metadata.constraints = [];

    const errors: ValidationError[] = [];
    const object = { prop: 'x' };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).performValidations(
      object,
      object.prop,
      'prop',
      {
        defined: [],
        custom: [metadata],
        nested: [],
        conditional: [],
        all: [metadata],
        hasPromiseValidation: false,
        customOnly: true,
      },
      errors
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('syncThenableInline');
  });

  it('should push a fast-path error when async work is pending without constraints due to stopAtFirstError', () => {
    const executor = new ValidationExecutor(new Validator(), { stopAtFirstError: true });
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata.constraints = [];
    metadata.resolvedConstraints = [
      {
        name: 'asyncPassConstraint',
        async: true,
        instance: {
          validate: () => Promise.resolve(true),
          defaultMessage: () => 'unused',
        },
      },
    ];

    const errors: ValidationError[] = [];
    const object = { prop: 'x' };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).performValidations(
      object,
      object.prop,
      'prop',
      {
        defined: [],
        custom: [metadata],
        nested: [],
        conditional: [],
        all: [metadata],
        hasPromiseValidation: false,
        customOnly: true,
      },
      errors
    );

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({});
  });

  it('should return immediately when customValidations receives no metadata', () => {
    const executor = new ValidationExecutor(new Validator());
    const getError = jest.fn(() => {
      throw new Error('should not be called');
    });

    (executor as any).customValidations({}, 'value', [], getError);

    expect(getError).not.toHaveBeenCalled();
  });

  it('should skip customValidations metadata when validateIf returns false', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'validateIfSkipped',
    });
    metadata.inlineValidate = jest.fn(() => false);
    metadata.validateIf = () => false;
    metadata.constraints = [];

    const getError = jest.fn(() => (executor as any).generateValidationError({}, 'value', 'prop'));

    (executor as any).customValidations({}, 'value', [metadata], getError);

    expect(metadata.inlineValidate).not.toHaveBeenCalled();
    expect(getError).not.toHaveBeenCalled();
  });

  it('should skip subsequent non-inline validators when stopAtFirstError and a constraint already exists', () => {
    const secondValidateSpy = jest.fn(() => false);
    const executor = new ValidationExecutor(new Validator(), { stopAtFirstError: true });

    const metadata1 = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata1.constraints = [];
    metadata1.resolvedConstraints = [
      {
        name: 'firstConstraint',
        async: false,
        instance: { validate: () => false, defaultMessage: () => 'first failed' },
      },
    ];

    const metadata2 = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata2.constraints = [];
    metadata2.resolvedConstraints = [
      {
        name: 'secondConstraint',
        async: false,
        instance: { validate: secondValidateSpy, defaultMessage: () => 'second failed' },
      },
    ];

    const object = { prop: 'x' };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) error = (executor as any).generateValidationError(object, object.prop, 'prop');
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [metadata1, metadata2], getError);

    expect(error).toBeDefined();
    expect(error.constraints).toHaveProperty('firstConstraint');
    expect(error.constraints).not.toHaveProperty('secondConstraint');
    expect(secondValidateSpy).not.toHaveBeenCalled();
  });

  it('should set context when async each-validation fails', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata.constraints = [];
    metadata.each = true;
    metadata.context = { tag: 'each-ctx' };
    metadata.resolvedConstraints = [
      {
        name: 'asyncEachConstraint',
        async: true,
        instance: { validate: () => Promise.resolve(false), defaultMessage: () => 'each async failed' },
      },
    ];

    const object = { prop: ['a', 'b'] };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) error = (executor as any).generateValidationError(object, object.prop, 'prop');
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [metadata], getError);

    return Promise.all((executor as any).awaitingPromises).then(() => {
      expect(error).toBeDefined();
      expect(error.constraints).toHaveProperty('asyncEachConstraint');
      expect(error.contexts).toEqual({ asyncEachConstraint: { tag: 'each-ctx' } });
    });
  });

  it('should skip non-nested and non-promise metadata types in nestedValidations', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
    });
    metadata.constraints = [];

    const error = (executor as any).generateValidationError({}, 'value', 'prop');
    (executor as any).nestedValidations('value', [metadata], error);

    expect(error.constraints).toEqual({});
  });

  it('should execute nested validations using a string schema target name', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.NESTED_VALIDATION,
      target: 'SchemaTarget' as any,
      propertyName: 'prop',
    });
    metadata.constraints = [];

    const child = { nested: true };
    const error = (executor as any).generateValidationError({}, child, 'prop');
    const executeSpy = jest.spyOn(executor as any, 'execute').mockImplementation(() => {});

    (executor as any).nestedValidations(child, [metadata], error);

    expect(executeSpy).toHaveBeenCalledWith(child, 'SchemaTarget', error.children);
    executeSpy.mockRestore();
  });

  it('should skip nested validations when stopAtFirstError is enabled and an error already exists', () => {
    const executor = new ValidationExecutor(new Validator(), { stopAtFirstError: true });
    const metadata = new ValidationMetadata({
      type: ValidationTypes.NESTED_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
    });
    metadata.constraints = [];

    const error = (executor as any).generateValidationError({}, { nested: true }, 'prop');
    error.constraints.existing = 'failed';
    const performSpy = jest.spyOn(executor as any, 'performValidations').mockImplementation(() => {});
    const executeSpy = jest.spyOn(executor as any, 'execute').mockImplementation(() => {});

    (executor as any).nestedValidations([{ nested: true }], [metadata], error);

    expect(performSpy).not.toHaveBeenCalled();
    expect(executeSpy).not.toHaveBeenCalled();
    performSpy.mockRestore();
    executeSpy.mockRestore();
  });

  it('should evaluate nested stopAtFirstError guard when constraints are undefined', () => {
    const executor = new ValidationExecutor(new Validator(), { stopAtFirstError: true });
    const metadata = new ValidationMetadata({
      type: ValidationTypes.NESTED_VALIDATION,
      target: 'SchemaTarget' as any,
      propertyName: 'prop',
    });
    metadata.constraints = [];

    const child = { nested: true };
    const error = (executor as any).generateValidationError({}, child, 'prop');
    error.constraints = undefined as any;
    const executeSpy = jest.spyOn(executor as any, 'execute').mockImplementation(() => {});

    (executor as any).nestedValidations(child, [metadata], error);

    expect(executeSpy).toHaveBeenCalledWith(child, 'SchemaTarget', error.children);
    executeSpy.mockRestore();
  });

  it('should use metadata.name for inline validators in mapContexts and initialise error.contexts', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      name: 'inlineCtxValidator',
    });
    metadata.inlineValidate = () => false;
    metadata.constraints = [];
    metadata.context = { role: 'inline' };

    const error = (executor as any).generateValidationError({}, 'value', 'prop');
    error.constraints['inlineCtxValidator'] = 'failed';

    (executor as any).mapContexts({}, 'value', [metadata], error);

    expect(error.contexts).toEqual({ inlineCtxValidator: { role: 'inline' } });
  });

  it('should use resolved constraint name for non-inline validators in mapContexts', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata.constraints = [];
    metadata.context = { role: 'non-inline' };
    metadata.resolvedConstraints = [{ name: 'resolvedConstraintName' }];

    const error = (executor as any).generateValidationError({}, 'value', 'prop');
    error.constraints['resolvedConstraintName'] = 'failed';

    (executor as any).mapContexts({}, 'value', [metadata], error);

    expect(error.contexts).toEqual({ resolvedConstraintName: { role: 'non-inline' } });
  });

  it('should fall back to metadata.type for inline validators without a name in mapContexts', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
    });
    metadata.inlineValidate = () => false;
    metadata.constraints = [];
    metadata.context = { role: 'inline-fallback' };

    const error = (executor as any).generateValidationError({}, 'value', 'prop');
    error.constraints[ValidationTypes.CUSTOM_VALIDATION] = 'failed';

    (executor as any).mapContexts({}, 'value', [metadata], error);

    expect(error.contexts).toEqual({ [ValidationTypes.CUSTOM_VALIDATION]: { role: 'inline-fallback' } });
  });

  it('should fall back to metadata.type when resolved constraints are fetched without a name in mapContexts', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class {},
    });
    metadata.constraints = [];
    metadata.context = { role: 'resolved-fallback' };
    (executor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [{}],
    };

    const error = (executor as any).generateValidationError({}, 'value', 'prop');
    error.constraints[ValidationTypes.CUSTOM_VALIDATION] = 'failed';

    (executor as any).mapContexts({}, 'value', [metadata], error);

    expect(error.contexts).toEqual({ [ValidationTypes.CUSTOM_VALIDATION]: { role: 'resolved-fallback' } });
  });

  it('should map context for async custom constraint failures', () => {
    const executor = new ValidationExecutor(new Validator());
    const metadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: TestTarget,
      propertyName: 'prop',
      constraintCls: class AsyncContextConstraint {},
    });
    metadata.constraints = [];
    metadata.context = { key: 'value' };
    (executor as any).metadataStorage = {
      getTargetValidatorConstraints: () => [
        {
          name: 'asyncContextConstraint',
          async: true,
          instance: {
            validate: () => Promise.resolve(false),
            defaultMessage: () => 'async failed',
          },
        },
      ],
    };

    const object = { prop: 'x' };
    let error: ValidationError | undefined;
    const getError = (): ValidationError => {
      if (!error) {
        error = (executor as any).generateValidationError(object, object.prop, 'prop');
      }
      return error;
    };

    (executor as any).currentTargetName = 'TestTarget';
    (executor as any).customValidations(object, object.prop, [metadata], getError);

    return Promise.all((executor as any).awaitingPromises).then(() => {
      expect(error).toBeDefined();
      expect(error.constraints).toHaveProperty('asyncContextConstraint');
      expect(error.contexts).toEqual({ asyncContextConstraint: { key: 'value' } });
    });
  });
});
