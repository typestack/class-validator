import { IsNotEmpty, ValidateIf, IsOptional, Equals } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import {IsNullable} from "../../src/decorator/common/IsNullable";

const validator = new Validator();

describe('conditional validation', () => {
  it("shouldn't validate a property when the condition is false", () => {
    expect.assertions(1);

    class MyClass {
      @ValidateIf(o => false)
      @IsNotEmpty()
      title: string;
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should validate a property when the condition is true', () => {
    expect.assertions(5);

    class MyClass {
      @ValidateIf(o => true)
      @IsNotEmpty()
      title: string = '';
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ isNotEmpty: 'title should not be empty' });
      expect(errors[0].value).toEqual('');
    });
  });

  it('should pass the object being validated to the condition function', () => {
    expect.assertions(3);

    class MyClass {
      @ValidateIf(o => {
        expect(o).toBeInstanceOf(MyClass);
        expect(o.title).toEqual('title');
        return true;
      })
      @IsNotEmpty()
      title: string = 'title';
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should validate a property when value is empty', () => {
    expect.assertions(5);

    class MyClass {
      @IsOptional()
      @Equals('test')
      title: string = '';
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title must be equal to test' });
      expect(errors[0].value).toEqual('');
    });
  });

  it('should validate a property when value is supplied', () => {
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

  it('should validate a property when value is supplied', () => {
    class MyClass {
      @IsNullable()
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

  it('should validate a property when value is undefined', () => {
    class MyClass {
      @IsNullable()
      @Equals('test')
      title: string = undefined;
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ equals: 'title must be equal to test' });
      expect(errors[0].value).toEqual(undefined);
    });
  });

  it("shouldn't validate a property when value is null", () => {
    class MyClass {
      @IsNullable()
      @Equals('test')
      title: string = null;
    }

    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });
});
