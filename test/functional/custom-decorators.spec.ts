import { Validator } from '../../src/validation/Validator';
import { ValidationArguments } from '../../src/validation/ValidationArguments';
import { registerDecorator } from '../../src/register-decorator';
import { ValidationOptions } from '../../src/decorator/ValidationOptions';
import { buildMessage, ValidatorConstraint } from '../../src/decorator/decorators';
import { ValidatorConstraintInterface } from '../../src/validation/ValidatorConstraintInterface';
import { useContainer } from '../../src/container';
import { getMetadataStorage, MetadataStorage } from '../../src/metadata/MetadataStorage';
import { ConstraintMetadata } from '../../src/metadata/ConstraintMetadata';

const validator = new Validator();

describe('decorator with inline validation', () => {
  function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        name: 'isLongerThan',
        validator: {
          validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            if (relatedValue === undefined || relatedValue === null) {
              return true;
            }

            const result =
              typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length;

            const asPromise = validationOptions && validationOptions.context && validationOptions.context.promise;

            return asPromise ? Promise.resolve(result) : result;
          },
        },
      });
    };
  }

  class MyClass {
    @IsLongerThan('lastName', {
      context: { foo: 'bar' },
      message: '$property must be longer then $constraint1. Given value: $value',
    })
    firstName: string;
    lastName: string;
  }

  class MyClassWithAsyncValidator {
    @IsLongerThan('lastName', {
      context: { foo: 'bar', promise: true },
      message: '$property must be longer then $constraint1. Given value: $value',
    })
    firstName: string;
    lastName: string;
  }

  it('if firstName is not empty and lastLame is empty then it should succeed', () => {
    expect.assertions(1);
    const model = new MyClass();
    model.firstName = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('if firstName is empty and lastLame is not empty then it should fail', () => {
    expect.assertions(2);
    const model = new MyClass();
    model.firstName = '';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ isLongerThan: 'firstName must be longer then lastName. Given value: ' });
    });
  });

  it('if firstName is shorter then lastLame then it should fail', () => {
    expect.assertions(2);
    const model = new MyClass();
    model.firstName = 'Li';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        isLongerThan: 'firstName must be longer then lastName. Given value: Li',
      });
    });
  });

  it('should include context', () => {
    expect.assertions(4);
    const model = new MyClass();
    const asyncModel = new MyClassWithAsyncValidator();
    model.firstName = asyncModel.firstName = 'Paul';
    model.lastName = asyncModel.lastName = 'Walker';

    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].contexts).toEqual({ isLongerThan: { foo: 'bar' } });
      return validator.validate(asyncModel).then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].contexts).toHaveProperty('isLongerThan.foo', 'bar');
      });
    });
  });
});

describe('decorator with default message', () => {
  function IsLonger(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        name: 'isLonger',
        validator: {
          validate(value: any, args: ValidationArguments): boolean {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            if (relatedValue === undefined || relatedValue === null) return true;

            return typeof value === 'string' && typeof relatedValue === 'string' && value.length > relatedValue.length;
          },
          defaultMessage(args: ValidationArguments): string {
            return args.property + ' must be longer then ' + args.constraints[0];
          },
        },
      });
    };
  }

  class SecondClass {
    @IsLonger('lastName')
    firstName: string;
    lastName: string;
  }

  it('if firstName is not empty and lastLame is empty then it should succeed', () => {
    expect.assertions(1);
    const model = new SecondClass();
    model.firstName = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('if firstName is empty and lastLame is not empty then it should fail', () => {
    expect.assertions(2);
    const model = new SecondClass();
    model.firstName = '';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ isLonger: 'firstName must be longer then lastName' });
    });
  });

  it('if firstName is shorter then lastLame then it should fail', () => {
    expect.assertions(2);
    const model = new SecondClass();
    model.firstName = 'Li';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({ isLonger: 'firstName must be longer then lastName' });
    });
  });
});

describe('decorator with separate validation constraint class', () => {
  @ValidatorConstraint({ name: 'isShortenThan' })
  class IsShortenThanConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
      const [relatedPropertyName] = args.constraints;
      const relatedValue = (args.object as any)[relatedPropertyName];
      if (value === null || value === undefined) return true;

      return typeof value === 'string' && typeof relatedValue === 'string' && value.length < relatedValue.length;
    }
  }

  function IsShorterThan(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: IsShortenThanConstraint,
      });
    };
  }

  class MyClass {
    firstName: string;

    @IsShorterThan('firstName', {
      message: '$property must be shorter then $constraint1. Given value: $value',
    })
    lastName: string;
  }

  it('if firstName is not empty and lastLame is empty then it should succeed', () => {
    expect.assertions(1);
    const model = new MyClass();
    model.firstName = 'hell no world';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('if firstName is empty and lastLame is not empty then it should fail', () => {
    expect.assertions(2);
    const model = new MyClass();
    model.firstName = '';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        isShortenThan: 'lastName must be shorter then firstName. Given value: Kim',
      });
    });
  });

  it('if firstName is shorter then lastLame then it should fail', () => {
    expect.assertions(2);
    const model = new MyClass();
    model.firstName = 'Li';
    model.lastName = 'Kim';
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        isShortenThan: 'lastName must be shorter then firstName. Given value: Kim',
      });
    });
  });
});

describe('decorator with symbol constraint', () => {
  const mySymbol = Symbol('mySymbol');

  function IsSameType(property: unknown, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: {
          validate(value: any, args: ValidationArguments) {
            return typeof value === typeof args.constraints[0];
          },
          defaultMessage: buildMessage(
            eachPrefix => eachPrefix + '$property must be of type ' + typeof property,
            validationOptions
          ),
        },
      });
    };
  }

  class MyClass {
    @IsSameType(mySymbol)
    property: symbol;
  }

  it('if property is not a symbol then it should fail', () => {
    expect.assertions(2);
    const model = new MyClass();
    return validator.validate(model).then(errors => {
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints.customValidation).toEqual('property must be of type symbol');
    });
  });
});

describe('inline custom decorator fast-path behavior', () => {
  afterEach(() => {
    useContainer(
      {
        get() {
          return undefined;
        },
      },
      { fallback: true }
    );
  });

  function InlineFailing(name: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName,
        name,
        options: validationOptions,
        validator: {
          validate(): boolean {
            return false;
          },
        },
      });
    };
  }

  function InlineAsyncPassing(name: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName,
        name,
        options: validationOptions,
        validator: {
          validate(): Promise<boolean> {
            return Promise.resolve(true);
          },
        },
      });
    };
  }

  it('should stop after first inline custom validator failure when stopAtFirstError is enabled', () => {
    class StopAtFirstErrorModel {
      @InlineFailing('firstError', { message: 'first message' })
      @InlineFailing('secondError', { message: 'second message' })
      value: string = 'x';
    }

    return validator.validate(new StopAtFirstErrorModel(), { stopAtFirstError: true }).then(errors => {
      expect(errors.length).toEqual(1);
      expect(Object.keys(errors[0].constraints).length).toEqual(1);
    });
  });

  it('should not create a visible error when inline async validator resolves true', () => {
    class AsyncPassModel {
      @InlineAsyncPassing('asyncPass')
      value: string = 'x';
    }

    return validator.validate(new AsyncPassModel()).then(errors => {
      expect(errors.length).toEqual(0);
    });
  });

  it('should use an empty default message when inline validator does not provide one', () => {
    class NoDefaultMessageModel {}

    registerDecorator({
      target: NoDefaultMessageModel,
      propertyName: 'value',
      name: 'noDefaultMessageValidator',
      validator: {
        validate(): boolean {
          return false;
        },
      },
    });

    const metadata = getMetadataStorage()
      .getTargetValidationMetadatas(NoDefaultMessageModel, '', false, false)
      .find(entry => entry.propertyName === 'value');
    const constraint = getMetadataStorage().getTargetValidatorConstraints(metadata!.constraintCls)[0];

    expect(constraint.instance.defaultMessage()).toEqual('');
    expect(metadata!.inlineDefaultMessage).toBeUndefined();
  });

  it('should throw when multiple constraint implementations are returned for a validator class', () => {
    @ValidatorConstraint()
    class DuplicateConstraint implements ValidatorConstraintInterface {
      validate(): boolean {
        return true;
      }
    }

    const metadataStorage = new MetadataStorage();
    metadataStorage.addConstraintMetadata(new ConstraintMetadata(DuplicateConstraint));
    metadataStorage.addConstraintMetadata(new ConstraintMetadata(DuplicateConstraint));

    useContainer({
      get(target: Function) {
        if (target === MetadataStorage) {
          return metadataStorage;
        }

        return new (target as any)();
      },
    });

    expect(() =>
      registerDecorator({
        target: DuplicateConstraint,
        propertyName: 'value',
        validator: DuplicateConstraint,
      })
    ).toThrow('More than one implementation of ValidatorConstraintInterface found');
  });
});
