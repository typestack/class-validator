import { Validator } from '../../src/validation/Validator';
import { ValidationArguments } from '../../src/validation/ValidationArguments';
import { registerDecorator } from '../../src/register-decorator';
import { ValidationOptions } from '../../src/decorator/ValidationOptions';
import { ValidatorConstraint, Validate, IsNotEmpty } from '../../src/decorator/decorators';
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

  it('should ignore async validations and validate only sync validation types (valid value)', () => {
    expect.assertions(1);
    const model = new SecondClass();
    model.firstName = 'such validation may lead';
    model.firstName = 'to recursion';
    model.name = 'Umed';
    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(0);
  });

  it('should ignore async validations and validate only sync validation types (invalid value)', () => {
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
