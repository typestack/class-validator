import "es6-shim";
import {IsNotEmpty, ValidateIf, IsOptional, Equals} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {ValidatorOptions} from "../../src/validation/ValidatorOptions";
import {expect} from "chai";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("conditional validation", function() {
    it("shouldn't validate a property when the condition is false", function() {
        class MyClass {
            @ValidateIf(o => false)
            @IsNotEmpty()
            title: string;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when the condition is true", function() {
        class MyClass {
            @ValidateIf(o => true)
            @IsNotEmpty()
            title: string = "";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({ isNotEmpty: "title should not be empty" });
            errors[0].value.should.be.equal("");
        });
    });

    it("should pass the object being validated to the condition function", function() {
        class MyClass {
            @ValidateIf(o => {
                expect(o).to.be.instanceOf(MyClass);
                expect(o.title).to.equal("title");
                return true;
            })
            @IsNotEmpty()
            title: string = "title";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when value is empty", function () {
        class MyClass {
            @IsOptional()
            @Equals("test")
            title: string = "";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({ equals: "title must be equal to test" });
            errors[0].value.should.be.equal("");
        });
    });

    it("should validate a property when value is supplied", function () {
        class MyClass {
            @IsOptional()
            @Equals("test")
            title: string = "bad_value";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({ equals: "title must be equal to test" });
            errors[0].value.should.be.equal("bad_value");
        });
    });
});
