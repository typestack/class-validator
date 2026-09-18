import {
  Contains,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
} from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { ValidationArguments } from '../../src/validation/ValidationArguments';

const validator = new Validator();

describe('inherited validation', () => {
  it('should retain different validators on a redeclared property across inheritance levels', async () => {
    class Base {
      @IsString()
      @MinLength(3)
      title: string;
    }
    class Child extends Base {
      @Contains('hello')
      title: string;
    }
    class Grandchild extends Child {
      @IsNotEmpty()
      title: string;
    }

    const model = new Grandchild();
    model.title = 'a';
    const errors = await validator.validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({
      contains: 'title must contain a hello string',
      minLength: 'title must be longer than or equal to 3 characters',
    });
    model.title = '';
    const emptyErrors = await validator.validate(model);
    expect(emptyErrors).toHaveLength(1);
    expect(emptyErrors[0].constraints).toEqual({
      isNotEmpty: 'title should not be empty',
      contains: 'title must contain a hello string',
      minLength: 'title must be longer than or equal to 3 characters',
    });
    model.title = 'hello';
    expect(await validator.validate(model)).toEqual([]);
  });

  it('should prefer the child constraints for the same named validator', async () => {
    class Base {
      @MinLength(10)
      title: string;
    }
    class Child extends Base {
      @MinLength(3)
      title: string;
    }

    const model = new Child();
    model.title = 'hello';
    expect(await validator.validate(model)).toEqual([]);
    model.title = 'a';
    const errors = await validator.validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({ minLength: 'title must be longer than or equal to 3 characters' });
  });

  it('should retain different custom constraint classes and prefer child constraints for the same class', async () => {
    @ValidatorConstraint({ name: 'startsWith' })
    class StartsWith {
      validate(value: string, args: ValidationArguments): boolean {
        return value.startsWith(args.constraints[0]);
      }
    }
    @ValidatorConstraint({ name: 'endsWith' })
    class EndsWith {
      validate(value: string, args: ValidationArguments): boolean {
        return value.endsWith(args.constraints[0]);
      }
    }
    class Base {
      @Validate(StartsWith, ['base'])
      @Validate(EndsWith, ['!'])
      title: string;
    }
    class Child extends Base {
      @Validate(StartsWith, ['child'])
      title: string;
    }

    const model = new Child();
    model.title = 'child';
    const errors = await validator.validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({ endsWith: '' });
    model.title = 'child!';
    expect(await validator.validate(model)).toEqual([]);
  });

  it('should retain inherited custom constraints when the child adds a named validator', async () => {
    @ValidatorConstraint({ name: 'hasHello' })
    class HasHello {
      validate(value: string): boolean {
        return value.includes('hello');
      }
    }
    class Base {
      @Validate(HasHello)
      title: string;
    }
    class Child extends Base {
      @IsNotEmpty()
      title: string;
    }

    const model = new Child();
    model.title = 'world';
    const errors = await validator.validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({ hasHello: '' });
  });

  it('should only override inherited validators in the selected group', async () => {
    class Base {
      @MinLength(10, { groups: ['base'] })
      title: string;
    }
    class Child extends Base {
      @MinLength(3, { groups: ['child'] })
      title: string;
    }

    const model = new Child();
    model.title = 'hello';
    const errors = await validator.validate(model, { groups: ['base'] });
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toEqual({ minLength: 'title must be longer than or equal to 10 characters' });
    expect(await validator.validate(model, { groups: ['child'] })).toEqual([]);
  });

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
});
