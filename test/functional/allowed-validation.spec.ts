import "es6-shim";
import {Allowed, ValidateNested} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {expect} from "chai";
import {ValidationTypes} from "../../src/validation/ValidationTypes";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: allowed validation
// -------------------------------------------------------------------------

describe("allowed validation", function () {

    it("should fail if an object has both allowed and not allowed properties", function () {

        class MyClass {
            @Allowed()
            title: string;

            @Allowed()
            views: number;
        }

        const model: any = new MyClass();

        model.title = "hello";
        model.unallowedProperty = 42;
        return validator.validate(model).then(errors => {
            expect(errors.length).to.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("unallowedProperty");
            errors[0].constraints.should.haveOwnProperty(ValidationTypes.ALLOWED);
        });
    });

  it("should succeed if an object only not allowed properties", function () {

    class MyClass {
      title: string;
      views: number;
    }

    const model: any = new MyClass();

    model.title = "hello";
    model.unallowedProperty = 42;
    return validator.validate(model).then(errors => {
      expect(errors.length).to.be.equal(0);
    });
  });

  it("should succeed if an object only allowed properties", function () {

    class MyClass {
      @Allowed()
      title: string;
      @Allowed()
      views: number;
    }

    const model: any = new MyClass();

    model.title = "hello";
    return validator.validate(model).then(errors => {
      expect(errors.length).to.be.equal(0);
    });
  });

  it("should validate only nested object if parent has no allowed decorators", function () {

    class SubClass {
      @Allowed()
      title: string;
    }

    class MyClass {
      title: string;

      @ValidateNested()
      sub: SubClass;
    }

    const model: any = new MyClass();

    model.title = "hello";
    model.sub = new SubClass();
    model.sub.title = "world!\n";
    model.sub.unallowedProperty = 42;
    return validator.validate(model).then(errors => {
      errors.should.have.lengthOf(1);
      errors[0].children.should.have.lengthOf(1);
      errors[0].children[0].target.should.be.equal(model.sub);
      errors[0].children[0].property.should.be.equal("unallowedProperty");
      errors[0].children[0].constraints.should.haveOwnProperty(ValidationTypes.ALLOWED);
    });
  });


});
