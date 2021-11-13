import { Allow, IsDefined, Min } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { ValidationTypes } from '../../src';

const validator = new Validator();

describe('whitelist validation', () => {
  it('should strip non whitelisted properties, but leave whitelisted untouched', () => {
    class MyClass {
      @IsDefined()
      title: string;

      @Min(0)
      views: number;
    }

    const model: any = new MyClass();

    model.title = 'hello';
    model.views = 56;
    model.unallowedProperty = 42;
    return validator.validate(model, { whitelist: true }).then(errors => {
      expect(errors.length).toEqual(0);
      expect(model.unallowedProperty).toBeUndefined();
      expect(model.title).toEqual('hello');
      expect(model.views).toEqual(56);
    });
  });

  it('should be able to whitelist with @Allow', () => {
    class MyClass {
      @Allow()
      views: number;
    }

    const model: any = new MyClass();

    model.views = 420;
    model.unallowedProperty = 'non-whitelisted';

    return validator.validate(model, { whitelist: true }).then(errors => {
      expect(errors.length).toEqual(0);
      expect(model.unallowedProperty).toBeUndefined();
      expect(model.views).toEqual(420);
    });
  });

  it('should throw an error when forbidNonWhitelisted flag is set', () => {
    class MyClass {}

    const model: any = new MyClass();

    model.unallowedProperty = 'non-whitelisted';

    return validator.validate(model, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('unallowedProperty');
      expect(errors[0].constraints).toHaveProperty(ValidationTypes.WHITELIST);
      expect(() => errors[0].toString()).not.toThrowError();
    });
  });

  it('should throw an error when whitelist and forbidNonWhitelisted flag are set with custom error message', () => {
    class MyClass {}

    const model: any = new MyClass();

    model.unallowedProperty = 'non-whitelisted';

    return validator.validate(model, { whitelist: true, forbidNonWhitelisted: "I'm a test" }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('unallowedProperty');
      expect(errors[0].constraints).toHaveProperty(ValidationTypes.WHITELIST);
      expect(errors[0].constraints).toEqual({ [ValidationTypes.WHITELIST]: "I'm a test" });
      expect(() => errors[0].toString()).not.toThrowError();
    });
  });

  it('should throw an error when whitelist and forbidNonWhitelisted flag are set with custom error message with replaced keyword', () => {
    class MyClass {
      someProperty: string;
    }

    const model: any = new MyClass();

    model.unallowedProperty = 'non-whitelisted';

    return validator
      .validate(model, {
        whitelist: true,
        forbidNonWhitelisted:
          'In $target I should not have the $property. its value is $value, however the $constraint1 is not set',
      })
      .then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('unallowedProperty');
        expect(errors[0].constraints).toHaveProperty(ValidationTypes.WHITELIST);
        expect(errors[0].constraints).toEqual({
          [ValidationTypes.WHITELIST]:
            'In MyClass I should not have the unallowedProperty. its value is non-whitelisted, however the $constraint1 is not set',
        });
        expect(() => errors[0].toString()).not.toThrowError();
      });
  });

  it('should throw an error without default error message when whitelist, forbidNonWhitelisted and dismissDefaultMessages flag are set', () => {
    class MyClass {
      someProperty: string;
    }

    const model: any = new MyClass();

    model.unallowedProperty = 'non-whitelisted';

    return validator
      .validate(model, {
        whitelist: true,
        dismissDefaultMessages: true,
        forbidNonWhitelisted: true,
      })
      .then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('unallowedProperty');
        expect(errors[0].constraints).toHaveProperty(ValidationTypes.WHITELIST);
        expect(errors[0].constraints).toEqual({
          [ValidationTypes.WHITELIST]: '',
        });
        expect(() => errors[0].toString()).not.toThrowError();
      });
  });
});
