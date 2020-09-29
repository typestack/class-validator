import { IsString, IsUrl, IsOptional, ValidateNested, MinLength } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { registerDecorator, ValidationArguments, ValidationOptions } from '../../src';

const validator = new Validator();

/**
 * TODO: needs to split these test into
 *   - testing basic toString
 *   - testing nested objects
 *   - testing arrays
 *   - testing color codes?
 */
describe('ValidationError', () => {
  it('should correctly log error message without ANSI escape codes', async () => {
    function MinLengthAsync(min: number, validationOptions?: ValidationOptions) {
      return function (object: object, propertyName: string): void {
        registerDecorator({
          target: object.constructor,
          propertyName: propertyName,
          options: validationOptions,
          constraints: [min],
          name: 'minLengthAsync',
          validator: {
            validate(value: any, args: ValidationArguments): Promise<boolean> | boolean {
              const [min] = args.constraints;

              const result = typeof value === 'string' && typeof min === 'number' && value.length >= min;

              const asPromise = validationOptions && validationOptions.context && validationOptions.context.promise;

              return asPromise ? Promise.resolve(result) : result;
            },
          },
        });
      };
    }

    class NestedClass {
      @IsString()
      public name: string;

      @IsUrl()
      public url: string;

      @IsOptional()
      @ValidateNested()
      public insideNested: NestedClass;

      constructor(url: string, name: any, insideNested?: NestedClass) {
        this.url = url;
        this.name = name;
        this.insideNested = insideNested;
      }
    }

    class RootClass {
      @IsString()
      @MinLength(15)
      public title: string;

      @ValidateNested()
      public nestedObj: NestedClass;

      @ValidateNested({ each: true })
      public nestedArr: NestedClass[];

      @MinLength(100, { each: true })
      public stringArr: string[];

      @MinLengthAsync(100, { each: true })
      public stringArrWithPromise: string[];

      constructor() {
        this.title = 5 as any;
        this.nestedObj = new NestedClass('invalid-url', 5, new NestedClass('invalid-url', 5));
        this.nestedArr = [new NestedClass('invalid-url', 5), new NestedClass('invalid-url', 5)];
        this.stringArr = ['invalid', 'invalid'];
        this.stringArrWithPromise = ['invalid', 'invalid'];
      }
    }

    const validationErrors = await validator.validate(new RootClass());
    expect(validationErrors[0].toString()).toEqual(
      'An instance of RootClass has failed the validation:\n' +
        ' - property title has failed the following constraints: minLength, isString \n'
    );
    expect(validationErrors[1].toString()).toEqual(
      'An instance of RootClass has failed the validation:\n' +
        ' - property nestedObj.name has failed the following constraints: isString \n' +
        ' - property nestedObj.url has failed the following constraints: isUrl \n' +
        ' - property nestedObj.insideNested.name has failed the following constraints: isString \n' +
        ' - property nestedObj.insideNested.url has failed the following constraints: isUrl \n'
    );
    expect(validationErrors[2].toString()).toEqual(
      'An instance of RootClass has failed the validation:\n' +
        ' - property nestedArr[0].name has failed the following constraints: isString \n' +
        ' - property nestedArr[0].url has failed the following constraints: isUrl \n' +
        ' - property nestedArr[1].name has failed the following constraints: isString \n' +
        ' - property nestedArr[1].url has failed the following constraints: isUrl \n'
    );
    expect(validationErrors[3].toString()).toEqual(
      'An instance of RootClass has failed the validation:\n' +
        ' - property stringArr[0] has failed the following constraints: minLength \n' +
        ' - property stringArr[1] has failed the following constraints: minLength \n'
    );
    expect(validationErrors[4].toString()).toEqual(
      'An instance of RootClass has failed the validation:\n' +
        ' - property stringArrWithPromise[0] has failed the following constraints: minLengthAsync \n' +
        ' - property stringArrWithPromise[1] has failed the following constraints: minLengthAsync \n'
    );
  });
});
