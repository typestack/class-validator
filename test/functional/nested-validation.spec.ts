import "es6-shim";
import {Contains, IsDefined, MinLength, ValidateNested} from "../../src/decorator/decorators";
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

            @ValidateNested()
            mySubSubClasses: MySubClass[][];

            @ValidateNested()
            mySubSubSubClasses: MySubClass[][][];
        }

        const model = new MyClass();
        model.title = "helo world";
        model.mySubClass = new MySubClass();
        model.mySubClass.name = "my";
        model.mySubClasses = [new MySubClass(), new MySubClass()];
        model.mySubClasses[0].name = "my";
        model.mySubClasses[1].name = "not-short";
        model.mySubSubClasses = [[new MySubClass()]];
        model.mySubSubClasses[0][0].name = "sub";
        model.mySubSubSubClasses = [[[new MySubClass()]]];
        model.mySubSubSubClasses[0][0][0].name = "sub";

        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(5);

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

            errors[3].target.should.be.equal(model);
            errors[3].property.should.be.equal("mySubSubClasses");
            errors[3].value.should.be.equal(model.mySubSubClasses);
            expect(errors[3].constraints).to.be.undefined;
            const subError3 = errors[3].children[0];
            subError3.target.should.be.equal(model.mySubSubClasses);
            subError3.value.should.be.equal(model.mySubSubClasses[0]);
            subError3.property.should.be.equal("0");
            const subSubError3 = subError3.children[0];
            subSubError3.target.should.be.equal(model.mySubSubClasses[0]);
            subSubError3.value.should.be.equal(model.mySubSubClasses[0][0]);
            subSubError3.property.should.be.equal("0");
            const subSubSubError3 = subSubError3.children[0];
            subSubSubError3.target.should.be.equal(model.mySubSubClasses[0][0]);
            subSubSubError3.property.should.be.equal("name");
            subSubSubError3.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subSubSubError3.value.should.be.equal("sub");


            errors[4].target.should.be.equal(model);
            errors[4].property.should.be.equal("mySubSubSubClasses");
            errors[4].value.should.be.equal(model.mySubSubSubClasses);
            expect(errors[4].constraints).to.be.undefined;
            const subError4 = errors[4].children[0];
            subError4.target.should.be.equal(model.mySubSubSubClasses);
            subError4.value.should.be.equal(model.mySubSubSubClasses[0]);
            subError4.property.should.be.equal("0");
            const subSubError4 = subError4.children[0];
            subSubError4.target.should.be.equal(model.mySubSubSubClasses[0]);
            subSubError4.value.should.be.equal(model.mySubSubSubClasses[0][0]);
            subSubError4.property.should.be.equal("0");
            const subSubSubError4 = subSubError4.children[0];
            subSubSubError4.target.should.be.equal(model.mySubSubSubClasses[0][0]);
            subSubSubError4.value.should.be.equal(model.mySubSubSubClasses[0][0][0]);
            subSubSubError4.property.should.be.equal("0");
            const subSubSubSubError4 = subSubSubError4.children[0];
            subSubSubSubError4.target.should.be.equal(model.mySubSubSubClasses[0][0][0]);
            subSubSubSubError4.property.should.be.equal("name");
            subSubSubSubError4.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subSubSubSubError4.value.should.be.equal("sub");
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

    it("should validate nested set", () => {

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
            mySubClasses: Set<MySubClass>;
        }

        const model = new MyClass();
        model.title = "helo world";
        model.mySubClass = new MySubClass();
        model.mySubClass.name = "my";
        model.mySubClasses = new Set();

        const submodel1 = new MySubClass();
        submodel1.name = "my";
        model.mySubClasses.add(submodel1);

        const submodel2 = new MySubClass();
        submodel2.name = "not-short";
        model.mySubClasses.add(submodel2);

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
            subError2.value.should.be.equal(submodel1);
            subError2.property.should.be.equal("0");
            const subSubError = subError2.children[0];
            subSubError.target.should.be.equal(submodel1);
            subSubError.property.should.be.equal("name");
            subSubError.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subSubError.value.should.be.equal("my");
        });

    });

    it("should validate nested map", () => {

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
            mySubClasses: Map<string, MySubClass>;
        }

        const model = new MyClass();
        model.title = "helo world";
        model.mySubClass = new MySubClass();
        model.mySubClass.name = "my";
        model.mySubClasses = new Map();

        const submodel1 = new MySubClass();
        submodel1.name = "my";
        model.mySubClasses.set("key1", submodel1);

        const submodel2 = new MySubClass();
        submodel2.name = "not-short";
        model.mySubClasses.set("key2", submodel2);

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
            subError2.value.should.be.equal(submodel1);
            subError2.property.should.be.equal("key1");
            const subSubError = subError2.children[0];
            subSubError.target.should.be.equal(submodel1);
            subSubError.property.should.be.equal("name");
            subSubError.constraints.should.be.eql({minLength: "name must be longer than or equal to 5 characters"});
            subSubError.value.should.be.equal("my");
        });

    });

});
