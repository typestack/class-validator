import "es6-shim";
import {
    IsNotEmpty,
    ValidateIf,
    IsOptional,
    Equals
} from "../../src/decorator/decorators";
import { Validator } from "../../src/validation/Validator";
import {
    ValidationOptions,
    registerDecorator,
    ValidationArguments
} from "../../src";
import { expect, should, use } from "chai";

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

describe("conditional validation", function() {
    it("shouldn't validate a property when the condition is false", function() {
        class MyClass {
            @ValidateIf(o => false)
            @IsNotEmpty()
            title: string;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when the condition is true", function() {
        class MyClass {
            @ValidateIf(o => true)
            @IsNotEmpty()
            title: string = "";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({
                isNotEmpty: "title should not be empty"
            });
            errors[0].value.should.be.equal("");
        });
    });

    it("should pass the object being validated to the condition function", function() {
        class MyClass {
            @ValidateIf(o => {
                expect(o).to.be.instanceOf(MyClass);
                expect(o.title).to.equal("title");
                return true;
            })
            @IsNotEmpty()
            title: string = "title";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when value is empty", function() {
        class MyClass {
            @IsOptional()
            @Equals("test")
            title: string = "";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({
                equals: "title must be equal to test"
            });
            errors[0].value.should.be.equal("");
        });
    });

    it("should validate a property when value is supplied", function() {
        class MyClass {
            @IsOptional()
            @Equals("test")
            title: string = "bad_value";
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
            errors[0].target.should.be.equal(model);
            errors[0].property.should.be.equal("title");
            errors[0].constraints.should.be.eql({
                equals: "title must be equal to test"
            });
            errors[0].value.should.be.equal("bad_value");
        });
    });

    it("should validate a property when no group is supplied - valid", function() {
        class MyClass {
            @IsOptional()
            @Equals(true)
            flag: boolean = true;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when no group is supplied - optional", function() {
        class MyClass {
            @IsOptional()
            @Equals(true)
            flag: boolean = undefined;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate a property when no group is supplied - invalid", function() {
        class MyClass {
            @IsOptional()
            @Equals(true)
            flag: boolean = false;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
        });
    });

    it("should not validate decorators with unspecified groups when a group is specified inside validate()", function() {
        class MyClass {
            @IsOptional()
            @Equals(true)
            flag: boolean = false;
        }

        const model = new MyClass();
        return validator
            .validate(model, { groups: ["aGroupWhichDoesNotExist"] })
            .then(errors => {
                errors.length.should.be.equal(0);
            });
    });

    it("should not validate decorators when validation groups are not matching", function() {
        class MyClass {
            @IsOptional({ groups: ["group1"] })
            @Equals(true, { groups: ["group1"] })
            flag: boolean = false;
        }

        const model = new MyClass();
        return validator
            .validate(model, { groups: ["aGroupWhichDoesNotExist"] })
            .then(errors => {
                errors.length.should.be.equal(0);
            });
    });

    it("should not validate any decorator if a custom conditional validator is blocking", function() {
        function IsConditionalNever(validationOptions?: ValidationOptions) {
            return function(object: Object, propertyName: string) {
                registerDecorator({
                    name: "isOptionalCustom",
                    target: object.constructor,
                    propertyName: propertyName,
                    constraints: [
                        (o: any, value: any) => {
                            return false;
                        }
                    ],
                    options: validationOptions,
                    validator: {
                        validate(value: any, args: ValidationArguments) {
                            return true;
                        }
                    }
                });
            };
        }

        class MyClass {
            @IsConditionalNever()
            @Equals(true)
            flag: boolean = undefined;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(0);
        });
    });

    it("should validate all decorators if a custom conditional validator is blocking", function() {
        function IsConditionalAlways(validationOptions?: ValidationOptions) {
            return function(object: Object, propertyName: string) {
                registerDecorator({
                    name: "isOptionalCustom",
                    target: object.constructor,
                    propertyName: propertyName,
                    constraints: [
                        (o: any, value: any) => {
                            return true;
                        }
                    ],
                    options: validationOptions,
                    validator: {
                        validate(value: any, args: ValidationArguments) {
                            return true;
                        }
                    }
                });
            };
        }

        class MyClass {
            @IsConditionalAlways({ message: "foo" })
            @Equals(true)
            flag: boolean = undefined;
        }

        const model = new MyClass();
        return validator.validate(model).then(errors => {
            errors.length.should.be.equal(1);
        });
    });
});
