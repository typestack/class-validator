import {expect} from "chai";
import {
    IsBooleanString,
    IsPositive,
    IsNegative,
    Contains,
    Equals,
    MinDate,
    MaxDate,
    IsAlpha,
    IsAlphanumeric,
    IsAscii,
    IsBase64,
    IsBoolean,
    IsByteLength,
    IsCreditCard,
    IsCurrency,
    IsDate,
    IsDivisibleBy,
    IsEmail,
    IsFQDN,
    IsFullWidth,
    IsHalfWidth,
    IsVariableWidth,
    IsHexColor,
    IsHexadecimal,
    IsIP,
    IsISBN,
    IsISO8601,
    IsIn,
    IsInt,
    IsJSON,
    Length,
    IsLowercase,
    IsMongoId,
    IsMultibyte,
    IsNumberString,
    IsSurrogatePair,
    IsUrl,
    IsUUID,
    IsUppercase,
    Matches,
    MinLength,
    MaxLength,
    Min,
    Max,
    IsNotEmpty,
    ArrayNotEmpty,
    ArrayMinSize,
    ArrayMaxSize,
    NotEquals,
    IsDateString,
    IsEmpty,
    IsDefined,
    IsNotIn,
    IsNumber,
    IsString,
    NotContains,
    ArrayContains,
    ArrayNotContains,
    ArrayUnique
} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {ValidatorOptions} from "../../src/validation/ValidatorOptions";

// -------------------------------------------------------------------------
// Helper functions
// -------------------------------------------------------------------------

export function checkValidValues(object: { someProperty: any }, values: any[], done: Function, validatorOptions?: ValidatorOptions) {
    const validator = new Validator();
    const promises = values.map(value => {
        object.someProperty = value;
        return validator
            .validate(object, validatorOptions)
            .then(errors => errors.length.should.be.equal(0));
    });
    Promise.all(promises).then(() => done(), err => done(err));
}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

const validator = new Validator();

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("Validation Options", function() {

    describe("message", function() {

        it("should contain a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a hello word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            // model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("String is not valid. You string must contain a hello word");
            });
        });

        it("$value token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$value is not valid. You string must contain a hello word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("hell no world is not valid. You string must contain a hello word");
            });
        });

        it("$constraint1 token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a $constraint1 word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("String is not valid. You string must contain a hello word");
            });
        });

        it("$target token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$target is not valid."
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("MyClass is not valid.");
            });
        });

        it("$property token should be replaced in a custom message", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$property is not valid."
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("someProperty is not valid.");
            });
        });

        it("should replace all token", function() {
            class MyClass {
                @Contains("hello", {
                    message: "$target#$property is not valid: $value must contain a $constraint1 word"
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("MyClass#someProperty is not valid: hell no world must contain a hello word");
            });
        });

    });

    describe("each", function() {

        it("should apply validation to each item in the array", function() {
            class MyClass {
                @Contains("hello", {
                    each: true
                })
                someProperty: string[];
            }

            const model = new MyClass();
            model.someProperty = ["hell no world", "hello", "helo world", "hello world", "hello dear friend"];
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].message.should.be.equal("each value in someProperty must contain a hello string");
                errors[0].value.should.be.equal(model.someProperty);
                errors[0].target.should.be.equal("MyClass");
                errors[0].property.should.be.equal("someProperty");
                errors[0].type.should.be.equal("contains");
            });
        });

    });

    describe("groups", function() {

        class MyClass {
            @Contains("hello", {
                groups: ["title-validation"]
            })
            title: string;

            @Contains("bye", {
                groups: ["text-validation"]
            })
            text: string;
        }

        const model1 = new MyClass();
        model1.title = "hello world";
        model1.text = "hello world";

        const model2 = new MyClass();
        model2.title = "bye world";
        model2.text = "bye world";

        const model3 = new MyClass();
        model3.title = "bye world";
        model3.text = "hello world";

        const model4 = new MyClass();
        model4.title = "hello world";
        model4.text = "bye world";

        it("should validate only properties of the given group", function() {
            return validator.validate(model1, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model2, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model2, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate only properties of the given group", function() {
            return validator.validate(model1, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model1, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model2, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model3, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(2);
            });
        });

        it("should validate only properties of the given groups", function() {
            return validator.validate(model4, { groups: ["title-validation", "text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model1).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model2).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model3).then(errors => {
                errors.length.should.be.equal(2);
            });
        });

        it("should validate all if no group is given", function() { // todo: all or without? what is better expected behaviour?
            return validator.validate(model4).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

    });

    describe("always", function() {

        class MyClass {
            @Contains("hello", {
                groups: ["title-validation"]
            })
            title: string;

            @Contains("bye", {
                groups: ["text-validation"],
                always: true
            })
            text: string;
        }

        const model1 = new MyClass();
        model1.title = "hello world";
        model1.text = "hello world";

        const model2 = new MyClass();
        model2.title = "bye world";
        model2.text = "bye world";

        it("should always validate a marked field no matter if group is specified", function() {
            return validator.validate(model1, { groups: ["title-validation"] }).then(errors => {
                errors.length.should.be.equal(1);
            });
        });

        it("should always validate a marked field no matter if group is specified", function() {
            return validator.validate(model2, { groups: ["text-validation"] }).then(errors => {
                errors.length.should.be.equal(0);
            });
        });

    });

});
