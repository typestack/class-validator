import { IsNotEmpty, ValidateBy } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';

const validator = new Validator();

declare module '../../src/validation/ExtraValidationArguments' {
  interface ExtraValidationArguments {
    t: (msg: string) => string;
  }
}

describe('validator options', () => {
  it('should not return target in validation error if validationError: { target: false } is set', () => {
    class MyClass {
      @IsNotEmpty()
      title: string = '';
      isActive: boolean;
    }

    const model = new MyClass();
    model.title = '';
    return validator
      .validate(model, { skipMissingProperties: true, validationError: { target: false } })
      .then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].target).toBeUndefined();
        expect(errors[0].property).toEqual('title');
        expect(errors[0].constraints).toEqual({ isNotEmpty: 'title should not be empty' });
        expect(errors[0].value).toEqual('');
      });
  });

  it('should returns error on unknown objects if forbidUnknownValues is true', function () {
    const anonymousObject = { badKey: 'This should not pass.' };

    return validator.validate(anonymousObject, { forbidUnknownValues: true }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(anonymousObject);
      expect(errors[0].property).toEqual(undefined);
      expect(errors[0].value).toEqual(undefined);
      expect(errors[0].children).toBeInstanceOf(Array);
      expect(errors[0].constraints).toEqual({ unknownValue: 'an unknown value was passed to the validate function' });
    });
  });

  it('should return no error on unknown objects if forbidUnknownValues is false', function () {
    const anonymousObject = { badKey: 'This should not pass.' };

    return validator.validate(anonymousObject, { forbidUnknownValues: false }).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should pass extra validation arguments to message builder', function () {
    class MyClass {
      @IsNotEmpty({ message: ({ t }) => t('this field should not be empty') })
      title: string = '';
      isActive: boolean;
    }

    const model = new MyClass();
    model.title = '';
    return validator.validate(model, { extraArguments: { t: msg => 'translated: ' + msg } }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ isNotEmpty: 'translated: this field should not be empty' });
    });
  });

  it('should pass extra validation arguments to default message builder', function () {
    class MyClass {
      @ValidateBy({
        name: 'customValidator',
        validator: {
          validate: () => false,
          defaultMessage: ({ t }) => t('custom error'),
        },
      })
      title: string = '';
      isActive: boolean;
    }

    const model = new MyClass();
    model.title = '';
    return validator.validate(model, { extraArguments: { t: msg => 'translated: ' + msg } }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ customValidator: 'translated: custom error' });
    });
  });
});
