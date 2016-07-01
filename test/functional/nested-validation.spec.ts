import {Contains, MinLength, ValidateNested} from "../../src/decorator/decorators";
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

describe("ValidateNested", function() {

    it("should validate nested objects", function() {

        class MySubClass {
            @MinLength(5)
            name: string;
        }

        class MyClass {
            @Contains("hello")
            title: string;

            @ValidateNested()
            mySubClass: MySubClass;

            @ValidateNested()
            mySubClasses: MySubClass[];
        }

        const model = new MyClass();
        model.title = "helo world";
        model.mySubClass = new MySubClass();
        model.mySubClass.name = "my";
        model.mySubClasses = [new MySubClass(), new MySubClass()];
        model.mySubClasses[0].name = "my";
        model.mySubClasses[1].name = "not-short";
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(3);

            errors[0].target.should.be.equal("MyClass");
            errors[0].property.should.be.equal("title");
            errors[0].type.should.be.equal("contains");
            errors[0].message.should.be.equal("title must contain a hello string");
            errors[0].value.should.be.equal("helo world");
            expect(errors[0].parentProperty).to.be.empty;
            expect(errors[0].parentTarget).to.be.empty;

            errors[1].target.should.be.equal("MySubClass");
            errors[1].property.should.be.equal("name");
            errors[1].type.should.be.equal("min_length");
            errors[1].message.should.be.equal("name must be longer than 5");
            errors[1].value.should.be.equal("my");
            errors[1].parentProperty.should.be.equal("mySubClass");
            errors[1].parentTarget.should.be.equal(model);

            errors[2].target.should.be.equal("MySubClass");
            errors[2].property.should.be.equal("name");
            errors[2].type.should.be.equal("min_length");
            errors[2].message.should.be.equal("name must be longer than 5");
            errors[2].value.should.be.equal("my");
            errors[2].parentProperty.should.be.equal("mySubClasses");
            errors[2].parentTarget.should.be.equal(model);
        });
    });

});
