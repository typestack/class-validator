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
    expect(Object.keys(error!.constraints)).toEqual(['firstInline']);
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
      expect(asyncError!.constraints).toHaveProperty('asyncConstraint');
      expect(syncError).toBeDefined();
      expect(syncError!.constraints).toHaveProperty('syncConstraint');
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
    expect(error!.constraints).toHaveProperty('eachConstraint');
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
      expect(error!.constraints).toHaveProperty('asyncContextConstraint');
      expect(error!.contexts).toEqual({ asyncContextConstraint: { key: 'value' } });
    });
  });
});
