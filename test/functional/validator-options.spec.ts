import { IsNotEmpty } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';

const validator = new Validator();

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

  it(`should return error on unknown objects if no options object argument is passed`, () => {
    const anonymousObject = { badKey: 'This should not pass.' };

    return validator.validate(anonymousObject, undefined).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(anonymousObject);
      expect(errors[0].property).toEqual(undefined);
      expect(errors[0].value).toEqual(undefined);
      expect(errors[0].children).toBeInstanceOf(Array);
      expect(errors[0].constraints).toEqual({ unknownValue: 'an unknown value was passed to the validate function' });
    });
  });

  it(`should return error on unknown objects if empty options object argument passed`, () => {
    const anonymousObject = { badKey: 'This should not pass.' };

    return validator.validate(anonymousObject, {}).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(anonymousObject);
      expect(errors[0].property).toEqual(undefined);
      expect(errors[0].value).toEqual(undefined);
      expect(errors[0].children).toBeInstanceOf(Array);
      expect(errors[0].constraints).toEqual({ unknownValue: 'an unknown value was passed to the validate function' });
    });
  });

  it(`should return error on unknown objects if options object argument passed with forbidUnknownValues undefined`, () => {
    const anonymousObject = { badKey: 'This should not pass.' };

    return validator.validate(anonymousObject, { forbidUnknownValues: undefined }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(anonymousObject);
      expect(errors[0].property).toEqual(undefined);
      expect(errors[0].value).toEqual(undefined);
      expect(errors[0].children).toBeInstanceOf(Array);
      expect(errors[0].constraints).toEqual({ unknownValue: 'an unknown value was passed to the validate function' });
    });
  });
});
