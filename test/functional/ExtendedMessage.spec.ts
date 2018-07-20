import "es6-shim";
import {
    ValidationArguments,
    Validator,
    ValidatorConstraint,
    ValidatorConstraintInterface, ValidatorOptions
} from "../../src";
import {MinLength} from "../../src";

import {should, use} from "chai";

import * as chaiAsPromised from "chai-as-promised";
import {Validate} from "../../src";

should();
use(chaiAsPromised);

const validator = new Validator();
const DETAILS_ENABLED: ValidatorOptions = {validationError: {extendedMessage: true}};

class StandardValidation {
    @MinLength(10)
    public readonly text: string = "invalid";
}

@ValidatorConstraint({name: "customText", async: false})
export class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string, args: ValidationArguments) {
        return text.length > (args.constraints || [10])[0];
    }

    defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
        return "Text ($value) is too short or too long: " + (args.constraints || [10])[0];
    }

}

describe("ExtendedMessage", () => {

    describe("disabled", () => {
        it("validates with simple message with default options", () => {
            // given
            const fixture = new StandardValidation();
            // when
            const errors = validator.validateSync(fixture);
            // then
            errors[0].constraints.should.be.eql({minLength: "text must be longer than or equal to 10 characters"});
        });

        it("validates with simple message with option disabled", () => {
            // given
            const fixture = new StandardValidation();
            // when
            const errors = validator.validateSync(fixture, {validationError: {extendedMessage: false}});
            // then
            errors[0].constraints.should.be.eql({minLength: "text must be longer than or equal to 10 characters"});
        });

    });

    describe("with standard validations", () => {
        it("validates with extended message", () => {
            // given
            const fixture = new StandardValidation();
            // when
            const errors = validator.validateSync(fixture, DETAILS_ENABLED);
            // then
            errors[0].constraints.should.be.eql({
                minLength: {
                    type: "minLength",
                    args: [10],
                    message: "text must be longer than or equal to 10 characters"
                }
            });
        });
    });

    describe("with custom validator", () => {
        it("validates with extended message (no arguments)", () => {
            // given
            class CustomValidation {
                @Validate(CustomTextLength)
                public readonly text: string = "invalid";
            }
            const fixture = new CustomValidation();

            // when
            const errors = validator.validateSync(fixture, DETAILS_ENABLED);

            // then
            errors[0].constraints.should.be.eql({
                customText: {
                    type: "customText",
                    args: [],
                    message: "Text (invalid) is too short or too long: 10"
                }
            });
        });

        it("validates with extended message (with arguments)", () => {
            // given
            class CustomValidation {
                @Validate(CustomTextLength, [20])
                public readonly text: string = "invalid";
            }
            const fixture = new CustomValidation();

            // when
            const errors = validator.validateSync(fixture, DETAILS_ENABLED);

            // then
            errors[0].constraints.should.be.eql({
                customText: {
                    type: "customText",
                    args: [20],
                    message: "Text (invalid) is too short or too long: 20"
                }
            });
        });

        it("validates with extended message (handles 'undefined' argument)", () => {
            // given
            class CustomValidation {
                @Validate(CustomTextLength, [undefined])
                public readonly text: string = "invalid";
            }
            const fixture = new CustomValidation();

            // when
            const errors = validator.validateSync(fixture, DETAILS_ENABLED);

            // then
            errors[0].constraints.should.be.eql({
                customText: {
                    type: "customText",
                    args: [undefined],
                    message: "Text (invalid) is too short or too long: undefined"
                }
            });
        });
    });

});