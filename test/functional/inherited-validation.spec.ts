import { Contains, MinLength } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';

const validator = new Validator();

describe('inherited validation', () => {
  it('should validate inherited properties', () => {
    expect.assertions(9);

    class MyClass {
      @Contains('hello')
      title: string;
    }

    class MySubClass extends MyClass {
      @MinLength(5)
      name: string;
    }

    const model = new MySubClass();
    model.title = 'helo world';
    model.name = 'my';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(2);
      // subclass own props are validated first
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('name');
      expect(errors[0].constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(errors[0].value).toEqual('my');
      // parent props are validated afterwards
      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('title');
      expect(errors[1].constraints).toEqual({ contains: 'title must contain a hello string' });
      expect(errors[1].value).toEqual('helo world');
    });
  });

  it('should use validators from parent and child classes', () => {
    expect.assertions(5);

    class MyClass {
      @Contains('hello')
      title: string;
    }

    class MySubClass extends MyClass {
      @MinLength(5)
      title: string;
    }

    const model = new MySubClass();
    model.title = 'helo';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({
        minLength: 'title must be longer than or equal to 5 characters',
        contains: 'title must contain a hello string',
      });
      expect(errors[0].value).toEqual('helo');
    });
  });
});
