import { Validator } from '../../src/validation/Validator';
import { registerDecorator } from '../../src/register-decorator';
import { ValidationOptions } from '../../src/decorator/ValidationOptions';
import { IsUUID } from '../../src/decorator/decorators';
import { ValidationTypes } from '../../src';

const validator = new Validator();

describe('custom conditional validation with context', () => {
  function ValidateForScope(scope: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string): void {
      registerDecorator({
        name: ValidationTypes.CONDITIONAL_VALIDATION,
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [
          (object, value, context) => {
            return context && context.scope === scope;
          },
        ],
        validator: () => true,
      });
    };
  }

  class MyClass {
    @ValidateForScope('SCOPE:UPDATE')
    @IsUUID()
    id: string;
  }

  it('if validation scope is equal to scope definition should run validation and fail', async () => {
    expect.assertions(2);

    return validator
      .validate(new MyClass(), {
        context: { scope: 'SCOPE:UPDATE' },
      })
      .then(errors => {
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toHaveProperty('isUuid');
      });
  });

  it('if validation scope is equal to scope definition should skip validation and pass', async () => {
    expect.assertions(1);

    let errors;
    errors = await validator.validate(new MyClass(), { context: { scope: 'SCOPE:CREATE' } });
    expect(errors.length).toEqual(0);
  });
});
