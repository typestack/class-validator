import { Contains, MinLength, Equals, Min } from '../../src/decorator/decorators';
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

  it('should override inherited validators in sub classes', () => {
    expect.assertions(9);

    class MyClass {
      @Min(30)
      age: number;

      @Equals('validator')
      first_name: string;

      @Equals('class')
      last_name: string;
    }

    class MySubClass extends MyClass {
      @Min(40)
      age: number;

      @Equals('class')
      first_name: string;

      @Equals('validator')
      last_name: string;
    }

    const model = new MySubClass();
    model.age = 20; // fail validation (using sub classes constraint)
    model.first_name = 'class'; // pass validation (overriding fail from parent)
    model.last_name = 'class'; // fail validation (overriding pass from parent)

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(2);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('age');
      expect(errors[0].constraints).toEqual({
        min: 'age must not be less than 40',
      });
      expect(errors[0].value).toEqual(20);

      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('last_name');
      expect(errors[1].constraints).toEqual({
        equals: 'last_name must be equal to validator',
      });
      expect(errors[1].value).toEqual('class');
    });
  });

  it('should not override different validators of inherited properties in the parent class', () => {
    expect.assertions(4);

    class MyClass {
      @Contains('parent-class')
      title: string;
    }

    class MySubClass extends MyClass {
      @Equals('sub-class')
      title: string;
    }

    const model = new MySubClass();
    model.title = 'sub-class';

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({
        contains: 'title must contain a parent-class string',
      });
    });
  });

  it('should not override different validators of inherited properties in the sub class', () => {
    expect.assertions(4);

    class MyClass {
      @Contains('parent-class')
      title: string;
    }

    class MySubClass extends MyClass {
      @Equals('sub-class')
      title: string;
    }

    const model = new MySubClass();
    model.title = 'parent-class';

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({
        equals: 'title must be equal to sub-class',
      });
    });
  });
});
