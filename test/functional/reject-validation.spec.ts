import "es6-shim";

import { ValidationError } from "./../../src/validation/ValidationError";
import { Contains, MinLength } from "../../src/decorator/decorators";
import { Validator } from "../../src/validation/Validator";
import { expect } from "chai";

import {should, use } from "chai";

import * as chaiAsPromised from "chai-as-promised";

should();
use(chaiAsPromised);

class MyClass {
    @Contains("hello", {
        message: "$value is not valid. Your string must contain a hello word"
    })
    someProperty: string;
}

describe("validateOrReject()", () => {
    let validator: Validator;
    let model: MyClass;

    beforeEach(() => {
        validator = new Validator();
        model = new MyClass();
    });

    it("should resolve promise when no error", (done) => {
        model.someProperty = "hello world";
        validator.validateOrReject(model)
        .then((args) => {
            expect(args).to.not.exist;
            done();
        })
        .catch((errors) => {
            done("should resolve promise");
        });
    });

    it("should reject promise on error", (done) => {
        model.someProperty = "hell no world";
        validator.validateOrReject(model)
        .then(() => {
            done("should reject promise");
        })
        .catch((errors: ValidationError[]) => {
            expect(errors).to.have.lengthOf(1);
            expect(errors[0].constraints).to.deep.equal({ contains: "hell no world is not valid. Your string must contain a hello word" });
            done();
        });
    });
});
