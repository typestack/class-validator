import "es6-shim";
import {Allow, IsDefined, Min, ValidateNested} from "../../src/decorator/decorators";
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

describe("whitelist validation", function () {

    it("should strip non whitelisted properties, but leave whitelisted untouched", function () {

        class MyClass {
            @IsDefined()
            title: string;

            @Min(0)
            views: number;
        }

        const model: any = new MyClass();

        model.title = "hello";
        model.views = 56;
        model.unallowedProperty = 42;
        return validator.validate(model, { whitelist: true }).then(errors => {
            expect(errors.length).to.be.equal(0);
            expect(model.unallowedProperty).be.undefined;
            expect(model.title).to.equal("hello");
            expect(model.views).to.be.equal(56);
        });
    });

    it("should be able to whitelist with @Allow", function () {

        class MyClass {
            @Allow()
            views: number;
        }

        const model: any = new MyClass();

        model.views = 420;
        model.unallowedProperty = "non-whitelisted";

        return validator.validate(model, { whitelist: true }).then(errors => {
            expect(errors.length).to.be.equal(0);
            expect(model.unallowedProperty).be.undefined;
            expect(model.views).to.be.equal(420);
        });
    });

    it("should throw an error when forbidNonWhitelisted flag is set", function () {

        class MyClass {
        }

        const model: any = new MyClass();

        model.unallowedProperty = "non-whitelisted";

        return validator.validate(model, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
            expect(errors.length).to.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("unallowedProperty");
            errors[0].constraints.should.haveOwnProperty(ValidationTypes.WHITELIST);
        });
    });

});
