import "es6-shim";
import {Contains, Matches, MinLength, ValidateNested, IsDefined} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {ValidationError} from "../../src";

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

describe("validation options", function() {

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
                errors[0].constraints.should.be.eql({ contains: "String is not valid. You string must contain a hello word" });
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
                errors[0].constraints.should.be.eql({ contains: "hell no world is not valid. You string must contain a hello word" });
            });
        });

        it("$value token should be replaced in a custom message", function() {
            class MyClass {
                @MinLength(2, {
                    message: args => {
                        if (args.value.length < 2) {
                            return "$value is too short, minimum length is $constraint1 characters $property";
                        }
                    }
                })
                name: string;
            }

            const model = new MyClass();
            model.name = "";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].constraints.should.be.eql({ minLength: " is too short, minimum length is 2 characters name" });
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
                errors[0].constraints.should.be.eql({ contains: "String is not valid. You string must contain a hello word" });
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
                errors[0].constraints.should.be.eql({ contains: "MyClass is not valid." });
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
                errors[0].constraints.should.be.eql({ contains: "someProperty is not valid." });
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
                errors[0].constraints.should.be.eql({ contains: "MyClass#someProperty is not valid: hell no world must contain a hello word" });
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
                errors[0].constraints.should.be.eql({ contains: "each value in someProperty must contain a hello string" });
                errors[0].value.should.be.equal(model.someProperty);
                errors[0].target.should.be.equal(model);
                errors[0].property.should.be.equal("someProperty");
            });
        });

    });

    describe("groups", function() {
        function expectTitleContains(error: ValidationError) {
            error.constraints.should.eql({ contains: "title must contain a hello string" });
        }

        function expectTextContains(error: ValidationError) {
            error.constraints.should.eql({ contains: "text must contain a bye string" });
        }

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

        const validTitle = new MyClass();
        validTitle.title = "hello world";
        validTitle.text = "hello world";

        const validText = new MyClass();
        validText.title = "bye world";
        validText.text = "bye world";

        const validBoth = new MyClass();
        validBoth.title = "hello world";
        validBoth.text = "bye world";

        const validNone = new MyClass();
        validNone.title = "bye world";
        validNone.text = "hello world";

        describe("should validate only properties of the given group: title-validation", function() {
            it("with valid title", function() {
                return validator.validate(validTitle, { groups: ["title-validation"] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with valid text", function() {
                return validator.validate(validText, { groups: ["title-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTitleContains(errors[0]);
                });
            });

            it("with both valid", function() {
                return validator.validate(validBoth, { groups: ["title-validation"] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with none valid", function() {
                return validator.validate(validNone, { groups: ["title-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTitleContains(errors[0]);
                });
            });

        });

        describe("should validate only properties of the given group: text-validation", function() {
            it("with valid title", function() {
                return validator.validate(validTitle, { groups: ["text-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

            it("with valid text", function() {
                return validator.validate(validText, { groups: ["text-validation"] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with both valid", function() {
                return validator.validate(validBoth, { groups: ["text-validation"] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with none valid", function() {
                return validator.validate(validNone, { groups: ["text-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

        });

        describe("should validate only properties of the given groups: both groups", function() {
            it("with valid title", function() {
                return validator.validate(validTitle, { groups: ["title-validation", "text-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

            it("with valid text", function() {
                return validator.validate(validText, { groups: ["title-validation", "text-validation"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTitleContains(errors[0]);
                });
            });

            it("with both valid", function() {
                return validator.validate(validBoth, { groups: ["title-validation", "text-validation"] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with none valid", function() {
                return validator.validate(validNone, { groups: ["title-validation", "text-validation"] }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });
        });

        describe("should validate all if no group is given", function() {
            it("with valid title", function() { // todo: all or without? what is better expected behaviour?
                return validator.validate(validTitle).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

            it("with valid text", function() { // todo: all or without? what is better expected behaviour?
                return validator.validate(validText).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTitleContains(errors[0]);
                });
            });

            it("with both valid", function() { // todo: all or without? what is better expected behaviour?
                return validator.validate(validBoth).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with none valid", function() { // todo: all or without? what is better expected behaviour?
                return validator.validate(validNone).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });

        });

        describe("should validate all groups if empty group array is given", function() {
            it("with valid title", function() {
                return validator.validate(validTitle, { groups: [] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

            it("with valid text", function() {
                return validator.validate(validText, { groups: [] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTitleContains(errors[0]);
                });
            });

            it("with both valid", function() {
                return validator.validate(validBoth, { groups: [] }).then(errors => {
                    errors.length.should.be.equal(0);
                });
            });

            it("with none valid", function() {
                return validator.validate(validNone, { groups: [] }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });
        });

        describe("multiple groups per property", function() {
            class MyClass {
                @Contains("hello", { groups: ["contains"] })
                @Matches(/.*stranger.*/, { groups: ["matches"] })
                title: string;
            }

            function expectTitleMatches(error: ValidationError) {
                error.constraints.should.eql({ matches: "title must match /.*stranger.*/ regular expression" });
            }

            const validContains = new MyClass();
            validContains.title = "hello";

            const validMatches = new MyClass();
            validMatches.title = "stranger";

            const validBoth = new MyClass();
            validBoth.title = "hello stranger";

            const validNone = new MyClass();
            validNone.title = "howdy rowdy";

            describe("group: contains", function() {
                it("with valid contains", function() {
                    return validator.validate(validContains, { groups: ["contains"] }).then(errors => {
                        errors.length.should.be.equal(0);
                    });
                });

                it("with valid matches", function() {
                    return validator.validate(validMatches, { groups: ["contains"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleContains(errors[0]);
                    });
                });

                it("with valid both", function() {
                    return validator.validate(validBoth, { groups: ["contains"] }).then(errors => {
                        errors.length.should.be.equal(0);
                    });
                });

                it("with valid none", function() {
                    return validator.validate(validNone, { groups: ["contains"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleContains(errors[0]);
                    });
                });

            });

            describe("group: matches", function() {

                it("with valid contains", function() {
                    return validator.validate(validContains, { groups: ["matches"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleMatches(errors[0]);
                    });
                });

                it("with valid matches", function() {
                    return validator.validate(validMatches, { groups: ["matches"] }).then(errors => {
                        errors.length.should.be.equal(0);
                    });
                });

                it("with valid both", function() {
                    return validator.validate(validBoth, { groups: ["matches"] }).then(errors => {
                        errors.length.should.be.equal(0);
                    });
                });

                it("with valid none", function() {
                    return validator.validate(validNone, { groups: ["matches"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleMatches(errors[0]);
                    });
                });

            });

            describe("groups: contains & matches", function() {
                it("with valid contains", function() {
                    return validator.validate(validContains, { groups: ["contains", "matches"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleMatches(errors[0]);
                    });
                });

                it("with valid matches", function() {
                    return validator.validate(validMatches, { groups: ["contains", "matches"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        expectTitleContains(errors[0]);
                    });
                });

                it("with valid both", function() {
                    return validator.validate(validBoth, { groups: ["contains", "matches"] }).then(errors => {
                        errors.length.should.be.equal(0);
                    });
                });

                it("with valid none", function() {
                    return validator.validate(validNone, { groups: ["contains", "matches"] }).then(errors => {
                        errors.length.should.be.equal(1);
                        errors[0].constraints.should.be.eql({
                            contains: "title must contain a hello string",
                            matches: "title must match /.*stranger.*/ regular expression"
                        });
                    });
                });

            });

        });

        describe("always", function() {

            class MyClass {
                @Contains("hello", {
                    groups: ["sometimes"]
                })
                title: string;

                @Contains("bye", {
                    groups: ["always"],
                    always: true
                })
                text: string;
            }

            const model = new MyClass();

            it("should always validate a marked field even if another group is specified", function() {
                return validator.validate(model, { groups: ["sometimes"] }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });

            it("should always validate a marked field if its group is specified also (doubly enabled)", function() {
                return validator.validate(model, { groups: ["always"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectTextContains(errors[0]);
                });
            });

            it("should always validate *all* fields if group is not specified", function() {
                return validator.validate(model, { groups: undefined }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });

            it("should always validate *all* fields if groups array is empty", function() {
                return validator.validate(model, { groups: [] }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectTitleContains(errors[0]);
                    expectTextContains(errors[1]);
                });
            });

        });

        describe("groups - nested", function() {
            class Nested {
                @Contains("hello", {
                    groups: ["always"],
                    always: true
                })
                text: string;
            }

            class Root {
                @ValidateNested({ groups: ["always"], always: true })
                always = new Nested;

                @ValidateNested({ groups: ["sometimes"] })
                sometimes = new Nested;

                @ValidateNested({ groups: ["other"] })
                other = new Nested;
            }

            const model = new Root();

            function expectChildConstraint(error: ValidationError, childName: string) {
                error.property.should.be.equal(childName);
                error.children.length.should.be.equal(1);
                error.children[0].property.should.be.equal("text");
                error.children[0].constraints.should.eql({ contains: "text must contain a hello string" });
            }

            it("should validate all children if no group is given", function() {
                return validator.validate(model, { groups: undefined }).then(errors => {
                    errors.length.should.be.equal(3);
                    expectChildConstraint(errors[0], "always");
                    expectChildConstraint(errors[1], "sometimes");
                    expectChildConstraint(errors[2], "other");
                });
            });

            it("should validate only the given group + always", function() {
                return validator.validate(model, { groups: ["sometimes"] }).then(errors => {
                    errors.length.should.be.equal(2);
                    expectChildConstraint(errors[0], "always");
                    expectChildConstraint(errors[1], "sometimes");
                });
            });

            it("should validate only the given group + always", function() {
                return validator.validate(model, { groups: ["always"] }).then(errors => {
                    errors.length.should.be.equal(1);
                    expectChildConstraint(errors[0], "always");
                });
            });
        });
    });

    describe("context", function() {

        it("should map context", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a hello word",
                    context: {
                        hi: "there"
                    }
                })
                someProperty: string;

                @Contains("bye", {
                    message: "String is not valid. You string must contain a bye word",
                    context: {
                        bye: "now"
                    }
                })
                someOtherProperty: string;

                @IsDefined({
                    context: {
                        foo: "bar"
                    }
                })
                requiredProperty: string;
            }

            const model = new MyClass();
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(3);
                errors[0].contexts["contains"].should.be.eql({ hi: "there" });
                errors[1].contexts["contains"].should.be.eql({ bye: "now" });
                errors[2].contexts["isDefined"].should.be.eql({ foo: "bar" });
            });
        });

        it("should map multiple context on a single property for different constraints", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a hello word",
                    context: {
                        hi: "there"
                    }
                })
                @MinLength(20, {
                    context: {
                        whats: "up"
                    }
                })
                someProperty: string;
            }

            const model = new MyClass();
            model.someProperty = "bippity";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(1);
                errors[0].contexts["contains"].should.be.eql({ hi: "there" });
                errors[0].contexts["minLength"].should.be.eql({ whats: "up" });
            });
        });

        it("should not map no context", function() {
            class MyClass {
                @Contains("hello", {
                    message: "String is not valid. You string must contain a hello word"
                })
                someProperty: string;

                @Contains("bye", {
                    message: "String is not valid. You string must contain a bye word",
                    context: {
                        bye: "now"
                    }
                })
                someOtherProperty: string;
            }

            const model = new MyClass();
            // model.someProperty = "hell no world";
            return validator.validate(model).then(errors => {
                errors.length.should.be.equal(2);
                should().equal(errors[0].contexts, undefined);
                errors[1].contexts["contains"].should.be.eql({ bye: "now" });
            });
        });

    });

});
