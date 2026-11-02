import { Equals, validateSync } from '../../src';
import { ValidationUtils } from '../../src/validation/ValidationUtils';
import { ValidationArguments } from '../../src/validation/ValidationArguments';

describe('validation message replacements', () => {
  const args: ValidationArguments = {
    targetName: 'Example',
    property: 'field',
    object: {},
    value: 'input',
    constraints: ['expected'],
  };

  for (const literal of ['$&', '$$', '$`', "$'"]) {
    it(`preserves ${literal} in values, constraints, properties and target names`, () => {
      expect(ValidationUtils.replaceMessageSpecialTokens('before $value after', { ...args, value: literal })).toBe(
        `before ${literal} after`
      );
      expect(
        ValidationUtils.replaceMessageSpecialTokens('before $constraint1 after', { ...args, constraints: [literal] })
      ).toBe(`before ${literal} after`);
      expect(
        ValidationUtils.replaceMessageSpecialTokens('before $property after', { ...args, property: literal })
      ).toBe(`before ${literal} after`);
      expect(
        ValidationUtils.replaceMessageSpecialTokens('before $target after', { ...args, targetName: literal })
      ).toBe(`before ${literal} after`);
    });
  }

  it('preserves replacement syntax in public validation errors', () => {
    class Example {
      @Equals('expected', { message: 'received $value' })
      field = '$&';
    }
    expect(validateSync(new Example())[0].constraints).toEqual({ equals: 'received $&' });
  });

  it('continues to interpolate repeated tokens, numbers and booleans', () => {
    expect(
      ValidationUtils.replaceMessageSpecialTokens('$value/$value/$constraint1/$property/$target', {
        ...args,
        value: 0,
        constraints: [false],
      })
    ).toBe('0/0/false/field/Example');
    expect(ValidationUtils.replaceMessageSpecialTokens('$value', { ...args, value: false })).toBe('false');
  });
});
