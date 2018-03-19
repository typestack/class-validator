import "es6-shim";
import {IsNotEmpty} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {expect} from "chai";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("validator options", function() {
    it("should not return target in validation error if validationError: { target: false } is set", function() {
        class MyClass {
            @IsNotEmpty()
            title: string = "";
            isActive: boolean;
        }

        const model = new MyClass();
        model.title = "";
        return validator.validate(model, { skipMissingProperties: true, validationError: { target: false } }).then(errors => {
            errors.length.should.be.equal(1);
            expect(errors[0].target).to.be.undefined;
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({ isNotEmpty: "title should not be empty" });
            errors[0].value.should.be.equal("");
        });
    });

    it("should returns error on unknown objects if forbidUnknownValues is true", function () {

        const anonymousObject = { badKey: "This should not pass." };

        return validator.validate(anonymousObject, { forbidUnknownValues: true }).then(errors => {
            errors.length.should.be.equal(1);
            expect(errors[0].target).to.be.equal(anonymousObject);
            expect(errors[0].property).to.be.equal(undefined);
            expect(errors[0].value).to.be.equal(undefined);
            errors[0].children.should.be.instanceof(Array);
            errors[0].constraints.should.be.eql({ unknownValue: "an unknown value was passed to the validate function" });
        });
    });

    it("should return no error on unknown objects if forbidUnknownValues is false", function () {

        const anonymousObject = { badKey: "This should not pass." };

        return validator.validate(anonymousObject, { forbidUnknownValues: false }).then(errors => {
            errors.length.should.be.equal(0);
        });
    });


});
