import { IsString, IsUrl, IsOptional, ValidateNested, MinLength } from '../../src/decorator/decorators';
import { StandardSchemaV1 } from '../../src/standard-schema/StandardSchema';
import { validationErrorToIssues } from '../../src/standard-schema/ValidationSchemaToStandardSchemaAdapters';
import { Validator } from '../../src/validation/Validator';

const validator = new Validator();

describe('ValidationErrorToStandardSchemaIssues', () => {
  it('Should correctly map the Validation Errors into standard schema issues', async () => {
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

      constructor() {
        this.title = 5 as any;
        this.nestedObj = new NestedClass('invalid-url', 5, new NestedClass('invalid-url', 5));
        this.nestedArr = [new NestedClass('invalid-url', 5), new NestedClass('invalid-url', 5)];
      }
    }

    const validationErrors = await validator.validate(new RootClass());
    const mappedErrors: StandardSchemaV1.Issue[] = [];

    validationErrors.forEach(valError => mappedErrors.push(...validationErrorToIssues(valError)));

    expect(mappedErrors).toHaveLength(10);

    expect(mappedErrors[0].path).toStrictEqual(['title']);
    expect(mappedErrors[0].message).toStrictEqual('title must be longer than or equal to 15 characters');

    expect(mappedErrors[1].path).toStrictEqual(['title']);
    expect(mappedErrors[1].message).toStrictEqual('title must be a string');

    expect(mappedErrors[2].path).toStrictEqual(['nestedObj', 'name']);
    expect(mappedErrors[2].message).toStrictEqual('name must be a string');

    expect(mappedErrors[3].path).toStrictEqual(['nestedObj', 'url']);
    expect(mappedErrors[3].message).toStrictEqual('url must be a URL address');

    expect(mappedErrors[4].path).toStrictEqual(['nestedObj', 'insideNested', 'name']);
    expect(mappedErrors[4].message).toStrictEqual('name must be a string');

    expect(mappedErrors[5].path).toStrictEqual(['nestedObj', 'insideNested', 'url']);
    expect(mappedErrors[5].message).toStrictEqual('url must be a URL address');

    expect(mappedErrors[6].path).toStrictEqual(['nestedArr', '0', 'name']);
    expect(mappedErrors[6].message).toStrictEqual('name must be a string');

    expect(mappedErrors[7].path).toStrictEqual(['nestedArr', '0', 'url']);
    expect(mappedErrors[7].message).toStrictEqual('url must be a URL address');

    expect(mappedErrors[8].path).toStrictEqual(['nestedArr', '1', 'name']);
    expect(mappedErrors[8].message).toStrictEqual('name must be a string');

    expect(mappedErrors[9].path).toStrictEqual(['nestedArr', '1', 'url']);
    expect(mappedErrors[9].message).toStrictEqual('url must be a URL address');
  });
});
