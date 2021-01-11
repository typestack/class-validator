import { ValidationError } from './../../src/validation/ValidationError';
import { Contains } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';

class MyClass {
  @Contains('hello', {
    message: '$value is not valid. Your string must contain a hello word',
  })
  someProperty: string;
}

describe('validateOrReject()', () => {
  let validator: Validator;
  let model: MyClass;

  beforeEach(() => {
    validator = new Validator();
    model = new MyClass();
  });

  it('should resolve promise when no error', () => {
    expect.assertions(1);
    model.someProperty = 'hello world';
    return validator.validateOrReject(model).then(args => {
      expect(args).toBeUndefined();
    });
  });

  it('should reject promise on error', () => {
    expect.assertions(2);
    model.someProperty = 'hell no world';
    return validator.validateOrReject(model).catch((errors: ValidationError[]) => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        contains: 'hell no world is not valid. Your string must contain a hello word',
      });
    });
  });
});
