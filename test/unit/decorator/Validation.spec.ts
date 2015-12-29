import * as chai from "chai";
import {expect} from "chai";
import * as sinon from "sinon";
import {defaultMetadataStorage} from "../../../src/metadata/MetadataStorage";
import {ValidatorConstraint} from "../../../src/decorator/Validation";
import {Validate} from "../../../src/decorator/Validation";
import {ValidationTypes} from "../../../src/types/ValidationTypes";
import {ValidatorInterface} from "../../../src/ValidatorInterface";
import {Contains} from "../../../src/decorator/Validation";
import {Equals} from "../../../src/decorator/Validation";
import {Validator} from "../../../src/Validator";
import {ValidationError} from "../../../src/ValidationError";
import {IsAfter} from "../../../src/decorator/Validation";
import {IsBefore} from "../../../src/decorator/Validation";
import {IsAlpha} from "../../../src/decorator/Validation";
import {IsAlphanumeric} from "../../../src/decorator/Validation";
import {IsAscii} from "../../../src/decorator/Validation";
import {IsBase64} from "../../../src/decorator/Validation";
import {IsBoolean} from "../../../src/decorator/Validation";
import {IsByteLength} from "../../../src/decorator/Validation";
import {IsCreditCard} from "../../../src/decorator/Validation";
import {IsCurrency} from "../../../src/decorator/Validation";
import {IsDate} from "../../../src/decorator/Validation";
import {IsDecimal} from "../../../src/decorator/Validation";

class TestClass {
    name: string;
}

class TestConstraint implements ValidatorInterface {
    validate(value: any): boolean {
        return !!value;
    }
}

let validator: Validator;

// -------------------------------------------------------------------------
// Specifications
// -------------------------------------------------------------------------

beforeEach(function() {
    validator = new Validator();
});

// -------------------------------------------------------------------------
// Specifications
// -------------------------------------------------------------------------

describe("ValidatorConstraint", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addConstraintMetadata");
        ValidatorConstraint()(TestClass);
        method.should.have.been.calledWith({
            sanitize: false,
            object: TestClass
        });
    }));

});

describe("Validate", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        Validate(TestConstraint)(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.CUSTOM_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            value1: TestConstraint,
            groups: undefined,
            message: undefined,
            always: undefined,
            each: undefined
        });
    }));

    it("should be able to set extra metadata options", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        Validate(TestConstraint, { always: true, each: true, message: "Error!", groups: ["main"] })(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.CUSTOM_VALIDATION,
            sanitize: false,
            object: TestClass,
            propertyName: "name",
            value1: TestConstraint,
            groups: ["main"],
            message: "Error!",
            always: true,
            each: true
        });
    }));

});

describe("Contains", function() {

    class MyClass {
        @Contains("hello")
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hello world";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "bye world";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("Equals", function() {

    class MyClass {
        @Equals("Alex")
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "Alex";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "Alexxx";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsAfter", function() {

    class MyClass {
        @IsAfter(new Date(1995, 11, 17))
        date: Date;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = new Date();
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = new Date(1994, 11, 17);
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsAlpha", function() {

    class MyClass {
        @IsAlpha()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomynameisalex";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hello1mynameisalex";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsAlphanumeric", function() {

    class MyClass {
        @IsAlphanumeric()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomyname1salex";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisalex";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsAscii", function() {

    class MyClass {
        @IsAscii()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellomyname1salex";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisлеха";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsBase64", function() {

    class MyClass {
        @IsBase64()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "aGVsbG8=";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "hell*mynameisalex";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsBefore", function() {

    class MyClass {
        @IsBefore(new Date(1995, 11, 17))
        date: Date;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = new Date(1994, 11, 17);
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = new Date();
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsBoolean", function() {

    class MyClass {
        @IsBoolean()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "true";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "trui";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsByteLength", function() {

    class MyClass {
        @IsByteLength(2, 20)
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "hellostring";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "helloveryveryveryverylongstring";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsCreditCard", function() {

    class MyClass {
        @IsCreditCard()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "4716-2210-5188-5662";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "9999-9999-9999-9999-9999";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsCurrency", function() {

    class MyClass {
        @IsCurrency()
        name: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.name = "$10,123.45";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.name = "$1.1";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsDate", function() {

    class MyClass {
        @IsDate()
        date: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = "2009-05-19 14:39:22-06:00";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = "2009-05-19 14a39a22";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});

describe("IsDecimal", function() {

    class MyClass {
        @IsDecimal()
        date: string;
    }

    it("should not fail validation if property is valid", function() {
        const object = new MyClass();
        object.date = "2009-05-19 14:39:22-06:00";
        validator.validate(object).length.should.be.equal(0);
        validator.validateAsync(object).should.eventually.equal(object);
        expect(() => validator.validateOrThrow(object)).not.to.throw(ValidationError);
        validator.isValid(object).should.be.equal(true);
    });

    it("should fail validation if property is not valid", function() {
        const object = new MyClass();
        object.date = "2009-05-19 14a39a22";
        validator.validate(object).length.should.be.equal(1);
        validator.validateAsync(object).should.eventually.be.rejected;
        expect(() => validator.validateOrThrow(object)).to.throw(ValidationError);
        validator.isValid(object).should.be.equal(false);
    });

});