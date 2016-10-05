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

});
