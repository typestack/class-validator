import { MetadataStorage } from '../../src/metadata/MetadataStorage';
import { ValidationMetadata } from '../../src/metadata/ValidationMetadata';
import { ValidationTypes } from '../../src/validation/ValidationTypes';

describe('MetadataStorage PR-2665 coverage', () => {
  class TestTarget {}

  function createMetadata(type: string, propertyName: string): ValidationMetadata {
    return new ValidationMetadata({
      type,
      target: TestTarget,
      propertyName,
    });
  }

  it('should build cache keys independent from group order', () => {
    const storage = new MetadataStorage();

    const first = storage.buildCacheKey(TestTarget, '', false, false, ['beta', 'alpha']);
    const second = storage.buildCacheKey(TestTarget, '', false, false, ['alpha', 'beta']);
    const strict = storage.buildCacheKey(TestTarget, '', false, true, ['alpha', 'beta']);

    expect(first).toEqual(second);
    expect(first).not.toEqual(strict);
  });

  it('should partition metadata and compute customOnly accurately', () => {
    const storage = new MetadataStorage();
    const cacheKey = storage.buildCacheKey(TestTarget, '', false, false, undefined);
    const grouped = {
      onlyCustom: [createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'onlyCustom')],
      withPromise: [
        createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'withPromise'),
        createMetadata(ValidationTypes.PROMISE_VALIDATION, 'withPromise'),
      ],
      withNestedAndConditional: [
        createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'withNestedAndConditional'),
        createMetadata(ValidationTypes.NESTED_VALIDATION, 'withNestedAndConditional'),
        createMetadata(ValidationTypes.CONDITIONAL_VALIDATION, 'withNestedAndConditional'),
      ],
      withDefined: [
        createMetadata(ValidationTypes.IS_DEFINED, 'withDefined'),
        createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'withDefined'),
      ],
      withWhitelist: [
        createMetadata(ValidationTypes.WHITELIST, 'withWhitelist'),
        createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'withWhitelist'),
      ],
    };

    const partitioned = storage.getPartitionedMetadata(grouped, cacheKey);
    const cached = storage.getPartitionedMetadata(grouped, cacheKey);

    expect(cached).toBe(partitioned);
    expect(partitioned.onlyCustom.customOnly).toEqual(true);
    expect(partitioned.withPromise.customOnly).toEqual(false);
    expect(partitioned.withPromise.hasPromiseValidation).toEqual(true);
    expect(partitioned.withNestedAndConditional.customOnly).toEqual(false);
    expect(partitioned.withDefined.customOnly).toEqual(false);
    expect(partitioned.withDefined.defined.length).toEqual(1);
    expect(partitioned.withWhitelist.all.length).toEqual(1);
  });

  it('should apply always/strictGroups metadata filtering consistently', () => {
    class GroupedTarget {}
    const storage = new MetadataStorage();
    const plain = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: GroupedTarget,
      propertyName: 'plain',
    });
    const grouped = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: GroupedTarget,
      propertyName: 'grouped',
    });
    grouped.groups = ['g1'];
    const explicitAlways = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: GroupedTarget,
      propertyName: 'always',
    });
    explicitAlways.groups = ['g2'];
    explicitAlways.always = true;

    storage.addValidationMetadata(plain);
    storage.addValidationMetadata(grouped);
    storage.addValidationMetadata(explicitAlways);

    const strictNoGroups = storage.getTargetValidationMetadatas(GroupedTarget, '', false, true);
    const strictProperties = strictNoGroups.map(metadata => metadata.propertyName);

    expect(strictProperties).toContain('plain');
    expect(strictProperties).toContain('always');
    expect(strictProperties).not.toContain('grouped');
  });
});
