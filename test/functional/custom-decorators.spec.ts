import "es6-shim";
import {Validator} from "../../src/validation/Validator";
import {ValidationArguments} from "../../src/validation/ValidationArguments";
import {registerDecorator} from "../../src/register-decorator";
import {ValidationOptions} from "../../src/decorator/ValidationOptions";
import {ValidatorConstraint} from "../../src/decorator/ValidatorConstraint";
import {ValidatorConstraintInterface} from "../../src/validation/ValidatorConstraintInterface";

import {should as chaiShould, use} from "chai";

import * as chaiAsPromised from "chai-as-promised";

const should = chaiShould();
use(chaiAsPromised);

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("custom decorators", function () {

    describe("decorator with inline validation", function () {

        function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
            return function (object: Object, propertyName: string) {
                registerDecorator({
                    target: object.constructor,
                    propertyName: propertyName,
                    options: validationOptions,
                    constraints: [property],
                    name: "isLongerThan",
                    validator: {
                        validate(value: any, args: ValidationArguments) {
                            const [relatedPropertyName] = args.constraints;
                            const relatedValue = (args.object as any)[relatedPropertyName];
                            if (relatedValue === undefined || relatedValue === null)
                                return true;

                            return typeof value === "string" &&
                                typeof relatedValue === "string" &&
                                value.length > relatedValue.length;
                        }
                    }
                });
            };
        }

        class MyClass {
            @IsLongerThan("lastName", {
                message: "$property must be longer then $constraint1. Given value: $value"
            })
            firstName: string;

            lastName: string;
        }

        it("if firstName is not empty and lastLame is empty then it should succeed", function () {
            const model = new MyClass();
            model.firstName = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("if firstName is empty and lastLame is not empty then it should fail", function () {
            const model = new MyClass();
            model.firstName = "";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isLongerThan: "firstName must be longer then lastName. Given value: "});
            });
        });

        it("if firstName is shorter then lastLame then it should fail", function () {
            const model = new MyClass();
            model.firstName = "Li";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isLongerThan: "firstName must be longer then lastName. Given value: Li"});
            });
        });

    });

    describe("decorator with default message", function () {

        function IsLonger(property: string, validationOptions?: ValidationOptions) {
            return function (object: Object, propertyName: string) {
                registerDecorator({
                    target: object.constructor,
                    propertyName: propertyName,
                    options: validationOptions,
                    constraints: [property],
                    name: "isLonger",
                    validator: {
                        validate(value: any, args: ValidationArguments) {
                            const [relatedPropertyName] = args.constraints;
                            const relatedValue = (args.object as any)[relatedPropertyName];
                            if (relatedValue === undefined || relatedValue === null)
                                return true;

                            return typeof value === "string" &&
                                typeof relatedValue === "string" &&
                                value.length > relatedValue.length;
                        },
                        defaultMessage(args: ValidationArguments) {
                            return args.property + " must be longer then " + args.constraints[0];
                        }
                    }
                });
            };
        }

        class SecondClass {
            @IsLonger("lastName")
            firstName: string;

            lastName: string;
        }

        it("if firstName is not empty and lastLame is empty then it should succeed", function () {
            const model = new SecondClass();
            model.firstName = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("if firstName is empty and lastLame is not empty then it should fail", function () {
            const model = new SecondClass();
            model.firstName = "";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isLonger: "firstName must be longer then lastName"});
            });
        });

        it("if firstName is shorter then lastLame then it should fail", function () {
            const model = new SecondClass();
            model.firstName = "Li";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isLonger: "firstName must be longer then lastName"});
            });
        });

    });

    describe("decorator with separate validation constraint class", function () {

        @ValidatorConstraint({name: "isShortenThan"})
        class IsShortenThanConstraint implements ValidatorConstraintInterface {

            validate(value: any, args: ValidationArguments) {
                const [relatedPropertyName] = args.constraints;
                const relatedValue = (args.object as any)[relatedPropertyName];
                if (value === null || value === undefined)
                    return true;

                return typeof value === "string" &&
                    typeof relatedValue === "string" &&
                    value.length < relatedValue.length;
            }

        }

        function IsShortenThan(property: string, validationOptions?: ValidationOptions) {
            return function (object: Object, propertyName: string) {
                registerDecorator({
                    target: object.constructor,
                    propertyName: propertyName,
                    options: validationOptions,
                    constraints: [property],
                    validator: IsShortenThanConstraint
                });
            };
        }

        class MyClass {
            firstName: string;

            @IsShortenThan("firstName", {
                message: "$property must be shorter then $constraint1. Given value: $value"
            })
            lastName: string;
        }

        it("if firstName is not empty and lastLame is empty then it should succeed", function () {
            const model = new MyClass();
            model.firstName = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("if firstName is empty and lastLame is not empty then it should fail", function () {
            const model = new MyClass();
            model.firstName = "";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isShortenThan: "lastName must be shorter then firstName. Given value: Kim"});
                should.not.exist(errors[0].contexts);
            });
        });

        it("if firstName is shorter then lastLame then it should fail", function () {
            const model = new MyClass();
            model.firstName = "Li";
            model.lastName = "Kim";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({isShortenThan: "lastName must be shorter then firstName. Given value: Kim"});
                should.not.exist(errors[0].contexts);
            });
        });

        describe("with context", () => {
            class MyClass {
                firstName: string;

                @IsShortenThan("firstName", {
                    message: "$property must be shorter then $constraint1. Given value: $value",
                    context: {foo: "bar"}
                })
                lastName: string;
            }

            it("if firstName is shorter then lastLame then error should contain context", function () {
                const model = new MyClass();
                model.firstName = "Li";
                model.lastName = "Kim";
                return validator.validate(model).then(errors => {
                    errors.length.should.be.equal(1);
                    errors[0].constraints.should.be.eql({isShortenThan: "lastName must be shorter then firstName. Given value: Kim"});
                    errors[0].contexts["isShortenThan"].should.be.eql({foo: "bar"});
                });
            });

        });

    });

});
