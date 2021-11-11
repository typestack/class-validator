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

  it('should resolve promise when no error', async () => {
    expect.assertions(1);
    model.someProperty = 'hello world';
    const args = await validator.validateOrReject(model);
    expect(args).toBeUndefined();
  });

  it('should reject promise on error', async () => {
    expect.assertions(2);
    model.someProperty = 'hell no world';
    let errors: ValidationError[];
    try {
      await validator.validateOrReject(model);
    } catch (caught) {
      errors = caught;
    }
    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toEqual({
      contains: 'hell no world is not valid. Your string must contain a hello word',
    });
  });
});
