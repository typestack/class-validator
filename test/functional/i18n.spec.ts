import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Equals, IsOptional } from '../../src/decorator/decorators';
import { setClassValidatorMessages, ClassPropertyTitle, ClassTitle } from '../../src/multi-lang';
import { Validator } from '../../src/validation/Validator';

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

  it('should validate a property when value is supplied with russian messages with translate property name', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      @ClassPropertyTitle('property "title"')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };
    const RU_I18N_TITLES = {
      'property "title"': 'поле "заголовок"',
    };

    const model = new MyClass();
    return validator.validate(model, { messages: RU_I18N_MESSAGES, titles: RU_I18N_TITLES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'поле "заголовок" должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied with russian messages with translate 2 property name', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      @ClassPropertyTitle('property "title"')
      title: string = 'bad_value';

      @IsOptional()
      @Equals('test2')
      @ClassPropertyTitle('property "title2"')
      title2: string = 'bad_value2';
    }

    const RU_I18N_MESSAGES = {
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };
    const RU_I18N_TITLES = {
      'property "title"': 'поле "заголовок"',
      'property "title2"': 'поле "заголовок2"',
    };

    const model = new MyClass();
    return validator.validate(model, { messages: RU_I18N_MESSAGES, titles: RU_I18N_TITLES }).then(errors => {
      expect(errors.length).toEqual(2);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'поле "заголовок" должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');

      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('title2');
      expect(errors[1].constraints).toEqual({ equals: 'поле "заголовок2" должно быть равно test2' });
      expect(errors[1].value).toEqual('bad_value2');
    });
  });

  it('should validate a property when value is supplied with russian messages with translate target name', () => {
    @ClassTitle('object "MyClass"')
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      '$property must be equal to $constraint1': '$property в $target должно быть равно $constraint1',
    };
    const RU_I18N_TITLES = {
      'object "MyClass"': 'объекте "МойКласс"',
    };

    const model = new MyClass();
    return validator.validate(model, { messages: RU_I18N_MESSAGES, titles: RU_I18N_TITLES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title в объекте "МойКласс" должно быть равно test' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied with russian messages with translate arguments for validation decorator', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };
    const RU_I18N_TITLES = {
      test: '"тест"',
    };

    const model = new MyClass();
    return validator.validate(model, { messages: RU_I18N_MESSAGES, titles: RU_I18N_TITLES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title должно быть равно "тест"' });
      expect(errors[0].value).toEqual('bad_value');
    });
  });

  it('should validate a property when value is supplied with russian messages with translate value', () => {
    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = 'bad_value';
    }

    const RU_I18N_MESSAGES = {
      '$property must be equal to $constraint1': '$property равно $value, а должно быть равно $constraint1',
    };
    const RU_I18N_TITLES = {
      bad_value: '"плохое_значение"',
    };

    const model = new MyClass();
    return validator.validate(model, { messages: RU_I18N_MESSAGES, titles: RU_I18N_TITLES }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title равно "плохое_значение", а должно быть равно test' });
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
      '$property must be equal to $constraint1': '$property должно быть равно $constraint1',
    };

    const FR_I18N_MESSAGES = {
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

    // in project: "node_modules/class-validator/i18n/ru.json"
    const RU_I18N_MESSAGES = JSON.parse(readFileSync(resolve(__dirname, '../../i18n/ru.json')).toString());

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

    setClassValidatorMessages({
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
