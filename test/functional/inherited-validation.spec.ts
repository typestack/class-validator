import "es6-shim";
import {Contains, MinLength} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("inherited validation", function() {

    it("should validate inherited properties", function() {

        class MyClass {
            @Contains("hello")
            title: string;
        }

        class MySubClass extends MyClass {
            @MinLength(5)
            name: string;
        }

        const model = new MySubClass();
        model.title = "helo world";
        model.name = "my";
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(2);

            // subclass own props are validated first
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("name");
            errors[0].constraints.should.be.eql({ minLength: "name must be longer than or equal to 5 characters" });
            errors[0].value.should.be.equal("my");

            // parent props are validated afterwards
            errors[1].target.should.be.equal(model);
            errors[1].property.should.be.equal("title");
            errors[1].constraints.should.be.eql({ contains: "title must contain a hello string" });
            errors[1].value.should.be.equal("helo world");
        });
    });

});