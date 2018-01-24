import "es6-shim";
import {Contains, IsDefined, MinLength, ValidateNested} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {expect} from "chai";
import {inspect} from "util";
import {ValidationTypes} from "../../src/validation/ValidationTypes";
// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("nested validation", function () {

    it("should not validate missing nested objects", function () {

        class MySubClass {
            @MinLength(5)
            name: string;
        }

        class MyClass {
            @Contains("hello")
            title: string;

            @ValidateNested() @IsDefined()
            mySubClass: MySubClass;
        }

        const model: any = new MyClass();

        model.title = "helo";
        return validator.validate(model).then(errors => {
            errors[1].target.should.be.equal(model);
            expect(errors[1].value).to.be.undefined;
            errors[1].property.should.be.equal("mySubClass");
            errors[1].constraints.should.be.eql({isDefined: "mySubClass should not be null or undefined"});
        });
    });


    it("should validate nested objects", function () {

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

            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({contains: "title must contain a hello string"});
            errors[0].value.should.be.equal("helo world");

            errors[1].target.should.be.equal(model);
            errors[1].property.should.be.equal("mySubClass");
            errors[1].value.should.be.equal(model.mySubClass);
            expect(errors[1].constraints).to.be.undefined;
            const subError1 = errors[1].children[0];
            subError1.target.should.be.equal(model.mySubClass);
            subError1.property.should.be.equal("name");
            subError1.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subError1.value.should.be.equal("my");

            errors[2].target.should.be.equal(model);
            errors[2].property.should.be.equal("mySubClasses");
            errors[2].value.should.be.equal(model.mySubClasses);
            expect(errors[2].constraints).to.be.undefined;
            const subError2 = errors[2].children[0];
            subError2.target.should.be.equal(model.mySubClasses);
            subError2.value.should.be.equal(model.mySubClasses[0]);
            subError2.property.should.be.equal("0");
            const subSubError = subError2.children[0];
            subSubError.target.should.be.equal(model.mySubClasses[0]);
            subSubError.property.should.be.equal("name");
            subSubError.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subSubError.value.should.be.equal("my");
        });
    });

    it("should validate when nested is not object", () => {

        class MySubClass {
            @MinLength(5)
            name: string;
        }

        class MyClass {
            @ValidateNested()
            mySubClass: MySubClass;

        }

        const model = new MyClass();
        model.mySubClass = <any> "invalidnested object";

        return validator.validate(model).then(errors => {

            expect(errors[0].target).to.equal(model);
            expect(errors[0].property).to.equal("mySubClass");
            expect(errors[0].children.length).to.equal(1);

            const subError = errors[0].children[0];
            subError.constraints.should.be.eql({[ValidationTypes.NESTED_VALIDATION]: "nested property mySubClass must be either object or array"});
        });

    });

});
