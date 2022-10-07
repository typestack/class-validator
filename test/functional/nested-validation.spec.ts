import { Contains, IsDefined, MinLength, ValidateNested } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { ValidationTypes } from '../../src/validation/ValidationTypes';

const validator = new Validator();

describe('nested validation', () => {
  it('should not validate missing nested objects', () => {
    expect.assertions(4);

    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @Contains('hello')
      title: string;

      @ValidateNested()
      @IsDefined()
      mySubClass: MySubClass;
    }

    const model: MyClass = new MyClass();
    model.title = 'helo';

    return validator.validate(model).then(errors => {
      expect(errors[1].target).toEqual(model);
      expect(errors[1].value).toBeUndefined();
      expect(errors[1].property).toEqual('mySubClass');
      expect(errors[1].constraints).toEqual({ isDefined: 'mySubClass should not be null or undefined' });
    });
  });

  it('should validate nested objects', () => {
    expect.assertions(55);

    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @Contains('hello')
      title: string;

      @ValidateNested()
      mySubClass: MySubClass;

      @ValidateNested()
      mySubClasses: MySubClass[];

      @ValidateNested()
      mySubSubClasses: MySubClass[][];

      @ValidateNested()
      mySubSubSubClasses: MySubClass[][][];
    }

    const model = new MyClass();
    model.title = 'helo world';
    model.mySubClass = new MySubClass();
    model.mySubClass.name = 'my';
    model.mySubClasses = [new MySubClass(), new MySubClass()];
    model.mySubClasses[0].name = 'my';
    model.mySubClasses[1].name = 'not-short';
    model.mySubSubClasses = [[new MySubClass()]];
    model.mySubSubClasses[0][0].name = 'sub';
    model.mySubSubSubClasses = [[[new MySubClass()]]];
    model.mySubSubSubClasses[0][0][0].name = 'sub';

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(5);

      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ contains: 'title must contain a hello string' });
      expect(errors[0].value).toEqual('helo world');

      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('mySubClass');
      expect(errors[1].value).toEqual(model.mySubClass);
      expect(errors[1].constraints).toBeUndefined();
      const subError1 = errors[1].children[0];
      expect(subError1.target).toEqual(model.mySubClass);
      expect(subError1.property).toEqual('name');
      expect(subError1.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subError1.value).toEqual('my');

      expect(errors[2].target).toEqual(model);
      expect(errors[2].property).toEqual('mySubClasses');
      expect(errors[2].value).toEqual(model.mySubClasses);
      expect(errors[2].constraints).toBeUndefined();
      const subError2 = errors[2].children[0];
      expect(subError2.target).toEqual(model.mySubClasses);
      expect(subError2.value).toEqual(model.mySubClasses[0]);
      expect(subError2.property).toEqual('0');
      const subSubError = subError2.children[0];
      expect(subSubError.target).toEqual(model.mySubClasses[0]);
      expect(subSubError.property).toEqual('name');
      expect(subSubError.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subSubError.value).toEqual('my');

      expect(errors[3].target).toEqual(model);
      expect(errors[3].property).toEqual('mySubSubClasses');
      expect(errors[3].value).toEqual(model.mySubSubClasses);
      expect(errors[3].constraints).toBeUndefined();
      const subError3 = errors[3].children[0];
      expect(subError3.target).toEqual(model.mySubSubClasses);
      expect(subError3.value).toEqual(model.mySubSubClasses[0]);
      expect(subError3.property).toEqual('0');
      const subSubError3 = subError3.children[0];
      expect(subSubError3.target).toEqual(model.mySubSubClasses[0]);
      expect(subSubError3.value).toEqual(model.mySubSubClasses[0][0]);
      expect(subSubError3.property).toEqual('0');
      const subSubSubError3 = subSubError3.children[0];
      expect(subSubSubError3.target).toEqual(model.mySubSubClasses[0][0]);
      expect(subSubSubError3.property).toEqual('name');
      expect(subSubSubError3.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subSubSubError3.value).toEqual('sub');

      expect(errors[4].target).toEqual(model);
      expect(errors[4].property).toEqual('mySubSubSubClasses');
      expect(errors[4].value).toEqual(model.mySubSubSubClasses);
      expect(errors[4].constraints).toBeUndefined();
      const subError4 = errors[4].children[0];
      expect(subError4.target).toEqual(model.mySubSubSubClasses);
      expect(subError4.value).toEqual(model.mySubSubSubClasses[0]);
      expect(subError4.property).toEqual('0');
      const subSubError4 = subError4.children[0];
      expect(subSubError4.target).toEqual(model.mySubSubSubClasses[0]);
      expect(subSubError4.value).toEqual(model.mySubSubSubClasses[0][0]);
      expect(subSubError4.property).toEqual('0');
      const subSubSubError4 = subSubError4.children[0];
      expect(subSubSubError4.target).toEqual(model.mySubSubSubClasses[0][0]);
      expect(subSubSubError4.value).toEqual(model.mySubSubSubClasses[0][0][0]);
      expect(subSubSubError4.property).toEqual('0');
      const subSubSubSubError4 = subSubSubError4.children[0];
      expect(subSubSubSubError4.target).toEqual(model.mySubSubSubClasses[0][0][0]);
      expect(subSubSubSubError4.property).toEqual('name');
      expect(subSubSubSubError4.constraints).toEqual({
        minLength: 'name must be longer than or equal to 5 characters',
      });
      expect(subSubSubSubError4.value).toEqual('sub');
    });
  });

  it('should validate when nested is not object', () => {
    expect.assertions(4);

    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @ValidateNested()
      mySubClass: MySubClass;
    }

    const model = new MyClass();
    model.mySubClass = 'invalidnested object' as any;

    return validator.validate(model).then(errors => {
      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('mySubClass');
      expect(errors[0].children.length).toEqual(0);
      expect(errors[0].constraints).toEqual({
        [ValidationTypes.NESTED_VALIDATION]: 'nested property mySubClass must be either object or array',
      });
    });
  });

  it('should validate nested set', () => {
    expect.assertions(24);

    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @Contains('hello')
      title: string;

      @ValidateNested()
      mySubClass: MySubClass;

      @ValidateNested()
      mySubClasses: Set<MySubClass>;
    }

    const model = new MyClass();
    model.title = 'helo world';
    model.mySubClass = new MySubClass();
    model.mySubClass.name = 'my';
    model.mySubClasses = new Set();

    const submodel1 = new MySubClass();
    submodel1.name = 'my';
    model.mySubClasses.add(submodel1);

    const submodel2 = new MySubClass();
    submodel2.name = 'not-short';
    model.mySubClasses.add(submodel2);

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(3);

      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ contains: 'title must contain a hello string' });
      expect(errors[0].value).toEqual('helo world');

      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('mySubClass');
      expect(errors[1].value).toEqual(model.mySubClass);
      expect(errors[1].constraints).toBeUndefined();
      const subError1 = errors[1].children[0];
      expect(subError1.target).toEqual(model.mySubClass);
      expect(subError1.property).toEqual('name');
      expect(subError1.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subError1.value).toEqual('my');

      expect(errors[2].target).toEqual(model);
      expect(errors[2].property).toEqual('mySubClasses');
      expect(errors[2].value).toEqual(model.mySubClasses);
      expect(errors[2].constraints).toBeUndefined();
      const subError2 = errors[2].children[0];
      expect(subError2.target).toEqual(model.mySubClasses);
      expect(subError2.value).toEqual(submodel1);
      expect(subError2.property).toEqual('0');
      const subSubError = subError2.children[0];
      expect(subSubError.target).toEqual(submodel1);
      expect(subSubError.property).toEqual('name');
      expect(subSubError.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subSubError.value).toEqual('my');
    });
  });

  it('should validate nested map', () => {
    expect.assertions(24);

    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @Contains('hello')
      title: string;

      @ValidateNested()
      mySubClass: MySubClass;

      @ValidateNested()
      mySubClasses: Map<string, MySubClass>;
    }

    const model = new MyClass();
    model.title = 'helo world';
    model.mySubClass = new MySubClass();
    model.mySubClass.name = 'my';
    model.mySubClasses = new Map();

    const submodel1 = new MySubClass();
    submodel1.name = 'my';
    model.mySubClasses.set('key1', submodel1);

    const submodel2 = new MySubClass();
    submodel2.name = 'not-short';
    model.mySubClasses.set('key2', submodel2);

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(3);

      expect(errors[0].target).toEqual(model);
      expect(errors[0].property).toEqual('title');
      expect(errors[0].constraints).toEqual({ contains: 'title must contain a hello string' });
      expect(errors[0].value).toEqual('helo world');

      expect(errors[1].target).toEqual(model);
      expect(errors[1].property).toEqual('mySubClass');
      expect(errors[1].value).toEqual(model.mySubClass);
      expect(errors[1].constraints).toBeUndefined();
      const subError1 = errors[1].children[0];
      expect(subError1.target).toEqual(model.mySubClass);
      expect(subError1.property).toEqual('name');
      expect(subError1.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subError1.value).toEqual('my');

      expect(errors[2].target).toEqual(model);
      expect(errors[2].property).toEqual('mySubClasses');
      expect(errors[2].value).toEqual(model.mySubClasses);
      expect(errors[2].constraints).toBeUndefined();
      const subError2 = errors[2].children[0];
      expect(subError2.target).toEqual(model.mySubClasses);
      expect(subError2.value).toEqual(submodel1);
      expect(subError2.property).toEqual('key1');
      const subSubError = subError2.children[0];
      expect(subSubError.target).toEqual(submodel1);
      expect(subSubError.property).toEqual('name');
      expect(subSubError.constraints).toEqual({ minLength: 'name must be longer than or equal to 5 characters' });
      expect(subSubError.value).toEqual('my');
    });
  });

  it('nestedValidation should be defined as an error for the property specifying the decorator when validation fails.', () => {
    class MySubClass {
      @MinLength(5)
      name: string;
    }

    class MyClass {
      @ValidateNested()
      nestedWithClassValue: MySubClass;

      @ValidateNested()
      nestedWithPrimitiveValue: MySubClass;
    }

    const model = new MyClass();
    model.nestedWithClassValue = new MySubClass();
    model.nestedWithPrimitiveValue = 'invalid' as any;

    return validator.validate(model, { stopAtFirstError: true }).then(errors => {
      expect(errors[0].property).toEqual('nestedWithClassValue');
      expect(errors[0].children.length).toEqual(1);
      expect(errors[0].children[0].constraints).toHaveProperty('minLength');
      expect(errors[1].property).toEqual('nestedWithPrimitiveValue');
      expect(errors[1].constraints).toHaveProperty('nestedValidation');
    });
  });
});
