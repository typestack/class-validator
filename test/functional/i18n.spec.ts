import { IsNotEmpty, ValidateIf, IsOptional, Equals } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { I18N_MESSAGES } from '../../src/decorator/get-text';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const validator = new Validator();

describe('i18n', () => {
  it('should validate a property when value is supplied with default messages', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const model = new MyClass();

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title must be equal to test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied with russian messages', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      ...I18N_MESSAGES,
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };

    const model = new MyClass();

    return validator.validate(model, { messages: RU_I18N_MESSAGES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied with russian and french messages', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      ...I18N_MESSAGES,
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };

    const FR_I18N_MESSAGES = {
      ...I18N_MESSAGES,
      '$property must be equal to $constraint1': '$property doit être égal à $constraint1',
    };

    const model = new MyClass();

    return validator.validate(model, { messages: RU_I18N_MESSAGES }).then(errors => {

      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');

      validator.validate(model, { messages: FR_I18N_MESSAGES }).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].target).toEqual(model);
        expect(errors[0].property).toEqual('title');
        expect(errors[0].constraints).toEqual({ equals: 'title doit être égal à test' });
        expect(errors[0].value).toEqual('bad_value');
      });
    });
  });

  it('should validate a property when value is supplied with russian messages from dictionaries', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    // in project: "node_modules/class-validator/i18n/messages-ru.json"
    const RU_I18N_MESSAGES = JSON.parse(readFileSync(resolve(__dirname, '../../i18n/messages-ru.json')).toString());

    const model = new MyClass();

    return validator.validate(model, { messages: RU_I18N_MESSAGES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title должен быть равен test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied override with russian messages', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    Object.assign(I18N_MESSAGES, {
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    });

    const model = new MyClass();

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

});
