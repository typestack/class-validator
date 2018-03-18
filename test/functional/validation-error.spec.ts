import "es6-shim";
import { IsNotEmpty, IsString, IsUrl, IsOptional, ValidateNested, MinLength } from "../../src/decorator/decorators";
import { Validator } from "../../src/validation/Validator";
import { expect } from "chai";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

/**
 * TODO: needs to split these test into
 *   - testing basic toString
 *   - testing nested objects
 *   - testing arrays
 *   - testing color codes?
 */
describe("ValidationError", function  () {
  it("should correctly log error message without ANSI escape codes", async function () {
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
        this.title = (5 as any);
        this.nestedObj = new NestedClass("invalid-url", 5, new NestedClass("invalid-url", 5));
        this.nestedArr = [new NestedClass("invalid-url", 5), new NestedClass("invalid-url", 5)];
      }
    }

    const validationErrors = await validator.validate(new RootClass());

    validationErrors[0].toString().should.be.equal("An instance of RootClass has failed the validation:\n" +
      " - property title has failed the following constraints: minLength, isString \n");

    validationErrors[1].toString().should.be.equal("An instance of RootClass has failed the validation:\n" +
      " - property nestedObj.name has failed the following constraints: isString \n" +
      " - property nestedObj.url has failed the following constraints: isUrl \n" +
      " - property nestedObj.insideNested.name has failed the following constraints: isString \n" +
      " - property nestedObj.insideNested.url has failed the following constraints: isUrl \n");

    validationErrors[2].toString().should.be.equal("An instance of RootClass has failed the validation:\n" +
      " - property nestedArr[0].name has failed the following constraints: isString \n" +
      " - property nestedArr[0].url has failed the following constraints: isUrl \n" +
      " - property nestedArr[1].name has failed the following constraints: isString \n" +
      " - property nestedArr[1].url has failed the following constraints: isUrl \n");
  });

});
