import "es6-shim";
import {Contains, IsDefined, MinLength, ValidateNested, ValidatePromise, MaxLength} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {expect} from "chai";
import {ValidationTypes} from "../../src/validation/ValidationTypes";

import {should, use } from "chai";

import * as chaiAsPromised from "chai-as-promised";

should();
use(chaiAsPromised);

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("promise validation", function () {

    it("should not validate missing nested objects", function () {

        class MySubClass {
            @MinLength(5)
            name: string;
        }

        class MyClass {
            @Contains("hello")
            title: string;

            @ValidatePromise() @ValidateNested() @IsDefined()
            mySubClass: Promise<MySubClass>;
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

            @ValidatePromise() @ValidateNested()
            mySubClass: Promise<MySubClass>;

            @ValidatePromise() @ValidateNested()
            mySubClasses: Promise<MySubClass[]>;
        }

        const model = new MyClass();
        model.title = "helo world";
        const mySubClass = new MySubClass();
        mySubClass.name = "my";
        model.mySubClass = Promise.resolve(mySubClass);
        const mySubClasses = [new MySubClass(), new MySubClass()];
        mySubClasses[0].name = "my";
        mySubClasses[1].name = "not-short";
        model.mySubClasses = Promise.resolve(mySubClasses);
        return validator.validate(model).then(errors => {
            return Promise.all([
                model.mySubClass,
                model.mySubClasses
            ]).then(([modelMySubClass, modelMySubClasses]) => {
                errors.length.should.be.equal(3);

                errors[0].target.should.be.equal(model);
                errors[0].property.should.be.equal("title");
                errors[0].constraints.should.be.eql({contains: "title must contain a hello string"});
                errors[0].value.should.be.equal("helo world");

                errors[1].target.should.be.equal(model);
                errors[1].property.should.be.equal("mySubClass");
                errors[1].value.should.be.equal(modelMySubClass);
                expect(errors[1].constraints).to.be.undefined;
                const subError1 = errors[1].children[0];
                subError1.target.should.be.equal(modelMySubClass);
                subError1.property.should.be.equal("name");
                subError1.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
                subError1.value.should.be.equal("my");

                errors[2].target.should.be.equal(model);
                errors[2].property.should.be.equal("mySubClasses");
                errors[2].value.should.be.equal(modelMySubClasses);
                expect(errors[2].constraints).to.be.undefined;
                const subError2 = errors[2].children[0];
                subError2.target.should.be.equal(modelMySubClasses);
                subError2.value.should.be.equal(modelMySubClasses[0]);
                subError2.property.should.be.equal("0");
                const subSubError = subError2.children[0];
                subSubError.target.should.be.equal(modelMySubClasses[0]);
                subSubError.property.should.be.equal("name");
                subSubError.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
                subSubError.value.should.be.equal("my");
            });
        });
    });

    it("should validate when nested is not object", () => {

        class MySubClass {
            @MinLength(5)
            name: string;
        }

        class MyClass {
            @ValidatePromise() @ValidateNested()
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

    it("should validate array promise", function () {

        class MyClass {
            @ValidatePromise() @MinLength(2)
            arrProperty: Promise<string[]>;
        }

        const model = new MyClass();
        model.arrProperty = Promise.resolve(["one"]);

        return validator.validate(model).then(errors => {
            return Promise.all([
                model.arrProperty,
            ]).then(([modelArrProperty]) => {
                errors.length.should.be.equal(1);

                errors[0].target.should.be.equal(model);
                errors[0].property.should.be.equal("arrProperty");
                errors[0].constraints.should.be.eql({minLength: "arrProperty must be longer than or equal to 2 characters"});
                errors[0].value.should.be.equal(modelArrProperty);
            });
        });
    });
});
