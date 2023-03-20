import { Validator } from '../../src/validation/Validator';
import { ValidationArguments } from '../../src/validation/ValidationArguments';
import { registerDecorator } from '../../src/register-decorator';
import { ValidationOptions } from '../../src/decorator/ValidationOptions';
import { ValidatorConstraint, Validate, IsNotEmpty, IsString, ValidateIf } from '../../src/decorator/decorators';
import { ValidatorConstraintInterface } from '../../src/validation/ValidatorConstraintInterface';

const validator = new Validator();

describe('sync validation should ignore async validation constraints', () => {
  @ValidatorConstraint({ name: 'isShortenThan', async: true })
  class IsShortenThanConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): Promise<boolean> {
      return Promise.resolve(false);
    }
  }

  function IsLonger(property: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        async: true,
        name: 'isLonger',
        validator: {
          validate(value: any, args: ValidationArguments): Promise<boolean> {
            return Promise.resolve(false);
          },
        },
      });
    };
  }

  class SecondClass {
    @IsLonger('lastName')
    firstName: string;

    @Validate(IsShortenThanConstraint)
    lastName: string;

    @IsNotEmpty({ message: 'name should not be empty' })
    name: string;

    @IsNotEmpty()
    alwaysWithValue: string = 'this field always has a value';
  }

  it('should ignore async validations and validate only sync validation types', () => {
    expect.assertions(1);
    const model = new SecondClass();
    model.firstName = 'such validation may lead';
    model.firstName = 'to recursion';
    model.name = 'Umed';
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(0);
  });

  it('should ignore async validations and validate only sync validation types', () => {
    expect.assertions(2);
    const model = new SecondClass();
    model.firstName = 'such validation may lead';
    model.firstName = 'to recursion';
    model.name = '';
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toEqual({ isNotEmpty: 'name should not be empty' });
  });
});

describe('sync CustomValidation should not ignore other validation annotations', () => {
  @ValidatorConstraint({ name: 'customValidation', async: false })
  class CustomValidation implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
      return true;
    }
  }

  class SecondClass {

    @Validate(CustomValidation)
    @ValidateIf((v) => !!v.name)
    @IsString()
    lastName: string | number;

    @IsString()
    name?: string;
  }

  it('validate the @Validate rule', () => {
    expect.assertions(1);
    const model: SecondClass = new SecondClass();
    model.lastName = 'Doe';
    model.name = 'John';
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(0);
  });

  it('should run other validation decorators if ValidateIf is satisfied', () => {
    expect.assertions(2);
    const model = new SecondClass();
    model.lastName = 4;
    model.name = 'Kostas';
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toEqual({ isString: 'lastName must be a string' });
  });

  it('should not run other validation decorators if ValidateIf is not satisfied', () => {
    expect.assertions(2);
    const model = new SecondClass();
    model.lastName = 5;
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(1);
    expect(errors[0].constraints).toEqual({ isString: 'name must be a string' });
  });
});