import { MetadataStorage } from '../../src/metadata/MetadataStorage';
import { ConstraintMetadata } from '../../src/metadata/ConstraintMetadata';
import { ValidationMetadata } from '../../src/metadata/ValidationMetadata';
import { ValidationSchema } from '../../src/validation-schema/ValidationSchema';
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

  it('should cache grouped metadata and reuse the same object for a cache key', () => {
    const storage = new MetadataStorage();
    const metadata = [createMetadata(ValidationTypes.CUSTOM_VALIDATION, 'prop')];

    const first = storage.groupByPropertyName(metadata, 'group-cache-key');
    const second = storage.groupByPropertyName([], 'group-cache-key');

    expect(second).toBe(first);
    expect(second.prop).toHaveLength(1);
  });

  it('should append constraint metadata for the same target', () => {
    class TestConstraint {}

    const storage = new MetadataStorage();
    storage.addConstraintMetadata(new ConstraintMetadata(TestConstraint, 'first'));
    storage.addConstraintMetadata(new ConstraintMetadata(TestConstraint, 'second'));

    expect(storage.getTargetValidatorConstraints(TestConstraint)).toHaveLength(2);
  });

  it('should cache target metadata results and include inherited grouped metadata', () => {
    class ParentTarget {}
    class ChildTarget extends ParentTarget {}

    const storage = new MetadataStorage();
    const inheritedGrouped = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ParentTarget,
      propertyName: 'inheritedGrouped',
    });
    inheritedGrouped.groups = ['g1'];

    storage.addValidationMetadata(inheritedGrouped);

    const cacheKey = storage.buildCacheKey(ChildTarget, '', false, false, ['g1']);
    const first = storage.getTargetValidationMetadatas(ChildTarget, '', false, false, ['g1'], cacheKey);
    const second = storage.getTargetValidationMetadatas(ChildTarget, '', false, false, ['g1'], cacheKey);

    expect(second).toBe(first);
    expect(first.map(metadata => metadata.propertyName)).toContain('inheritedGrouped');
  });

  it('should ignore inherited metadata whose target is not actually in the prototype chain', () => {
    class ParentTarget {}
    class ChildTarget extends ParentTarget {}
    class RogueTarget {}

    const storage = new MetadataStorage();
    const rogueMetadata = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: RogueTarget,
      propertyName: 'rogue',
    });

    (storage as any).validationMetadatas = new Map([[ParentTarget, [rogueMetadata]]]);

    expect(storage.getTargetValidationMetadatas(ChildTarget, '', false, false)).toEqual([]);
  });

  it('should transform validation schemas into metadata entries', () => {
    const storage = new MetadataStorage();
    const schema: ValidationSchema = {
      name: 'SchemaTarget',
      properties: {
        field: [
          {
            type: ValidationTypes.CUSTOM_VALIDATION,
            name: 'schemaConstraint',
            constraints: ['x'],
            message: 'schema message',
          },
        ],
      },
    };

    storage.addValidationSchema(schema);

    const metadatas = (storage as any).validationMetadatas.get('SchemaTarget');
    expect(metadatas).toHaveLength(1);
    expect(metadatas[0].name).toEqual('schemaConstraint');
    expect(metadatas[0].propertyName).toEqual('field');
  });

  it('should ignore original metadata entries whose target does not match the constructor or schema', () => {
    class ActualTarget {}
    class OtherTarget {}

    const storage = new MetadataStorage();
    const mismatched = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: OtherTarget,
      propertyName: 'mismatch',
    });

    (storage as any).validationMetadatas = new Map([[ActualTarget, [mismatched]]]);

    expect(storage.getTargetValidationMetadatas(ActualTarget, '', false, false)).toEqual([]);
  });

  it('should exclude string and self-targeted inherited metadata', () => {
    class ParentTarget {}
    class ChildTarget extends ParentTarget {}

    const storage = new MetadataStorage();
    const schemaInherited = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: 'SchemaTarget',
      propertyName: 'schemaInherited',
    });
    const selfInherited = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ChildTarget,
      propertyName: 'selfInherited',
    });
    const validInherited = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ParentTarget,
      propertyName: 'validInherited',
    });
    validInherited.always = true;

    (storage as any).validationMetadatas = new Map([[ParentTarget, [schemaInherited, selfInherited, validInherited]]]);

    const metadatas = storage.getTargetValidationMetadatas(ChildTarget, '', false, true);

    expect(metadatas.map(metadata => metadata.propertyName)).toEqual(['validInherited']);
  });

  it('should prefer original metadata over inherited metadata with the same property and type', () => {
    class ParentTarget {}
    class ChildTarget extends ParentTarget {}

    const storage = new MetadataStorage();
    const original = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ChildTarget,
      propertyName: 'shared',
    });
    const inheritedDuplicate = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ParentTarget,
      propertyName: 'shared',
    });

    storage.addValidationMetadata(original);
    storage.addValidationMetadata(inheritedDuplicate);

    const metadatas = storage.getTargetValidationMetadatas(ChildTarget, '', false, false);

    expect(metadatas).toHaveLength(1);
    expect(metadatas[0]).toBe(original);
  });

  it('should exclude inherited grouped metadata when strictGroups is enabled without groups', () => {
    class ParentTarget {}
    class ChildTarget extends ParentTarget {}

    const storage = new MetadataStorage();
    const inheritedGrouped = new ValidationMetadata({
      type: ValidationTypes.CUSTOM_VALIDATION,
      target: ParentTarget,
      propertyName: 'inheritedGrouped',
    });
    inheritedGrouped.groups = ['g1'];

    storage.addValidationMetadata(inheritedGrouped);

    expect(storage.getTargetValidationMetadatas(ChildTarget, '', false, true)).toEqual([]);
  });
});
