import { IsNotEmpty, ValidateIf, IsOptional, Equals, IsUUID, IsString } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';

const validator = new Validator();

describe('Selective validation with `propertiesToValidate` validator option', () => {
  const VALUE = 'testString';

  class MyClass {
    @IsNotEmpty()
    @IsString()
    foo: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    bar: string;

    @IsNotEmpty()
    @IsString()
    notEmptyProp: string = VALUE;
  }

  const model = new MyClass();

  it('should validate only selected properties, if `propertiesToValidate` list is set', async () => {
    expect.assertions(2);

    await validator.validate(model, { propertiesToValidate: ['notEmptyProp'] }).then(errors => {
      expect(errors.length).toEqual(0);
    });

    const errors = validator.validateSync(model, { propertiesToValidate: ['notEmptyProp'] });
    expect(errors.length).toEqual(0);
  });

  it('should validate all properties when `propertiesToValidate` list is not set', async () => {
    expect.assertions(4);

    const EXPECTED_TO_FAIL_PROPS = ['foo', 'bar'];

    await validator.validate(model).then(errors => {
      expect(errors.length).toEqual(EXPECTED_TO_FAIL_PROPS.length);
      expect(errors.map(error => error.property)).toEqual(EXPECTED_TO_FAIL_PROPS);
    });

    const errors = validator.validateSync(model);
    expect(errors.length).toEqual(EXPECTED_TO_FAIL_PROPS.length);
    expect(errors.map(error => error.property)).toEqual(EXPECTED_TO_FAIL_PROPS);
  });
});
