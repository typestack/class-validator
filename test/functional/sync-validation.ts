import "es6-shim";
import {Validator} from "../../src/validation/Validator";
import {ValidationArguments} from "../../src/validation/ValidationArguments";
import {registerDecorator} from "../../src/register-decorator";
import {ValidationOptions} from "../../src/decorator/ValidationOptions";
import {ValidatorConstraint, Validate, IsNotEmpty} from "../../src/decorator/decorators";
import {ValidatorConstraintInterface} from "../../src/validation/ValidatorConstraintInterface";

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

describe("sync validation", function() {

    describe("sync validation should ignore async validation constraints", function() {

        @ValidatorConstraint({ name: "isShortenThan", async: true })
        class IsShortenThanConstraint implements ValidatorConstraintInterface {

            validate(value: any, args: ValidationArguments) {
                return Promise.resolve(false);
            }

        }

        function IsLonger(property: string, validationOptions?: ValidationOptions) {
            return function (object: Object, propertyName: string) {
                registerDecorator({
                    target: object.constructor,
                    propertyName: propertyName,
                    options: validationOptions,
                    constraints: [property],
                    async: true,
                    name: "isLonger",
                    validator: {
                        validate(value: any, args: ValidationArguments) {
                            return Promise.resolve(false);
                        }
                    }
                });
            };
        }

        class SecondClass {
            @IsLonger("lastName")
            firstName: string;

            @Validate(IsShortenThanConstraint)
            lastName: string;

            @IsNotEmpty({ message: "name should not be empty" })
            name: string;

            @IsNotEmpty()
            alwaysWithValue: string = "this field always has a value";
        }

        it("should ignore async validations and validate only sync validation types", function() {
            const model = new SecondClass();
            model.firstName = "such validation may lead";
            model.firstName = "to recursion";
            model.name = "Umed";
            const errors = validator.validateSync(model);
            errors.length.should.be.equal(0);
        });

        it("should ignore async validations and validate only sync validation types", function() {
            const model = new SecondClass();
            model.firstName = "such validation may lead";
            model.firstName = "to recursion";
            model.name = "";
            const errors = validator.validateSync(model);
            errors.length.should.be.equal(1);
            errors[0].constraints.should.be.eql({ isNotEmpty: "name should not be empty" });
        });

    });

});
