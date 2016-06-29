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
    IsDecimal,
    DivisibleBy,
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
    GreaterThen,
    LessThen,
    IsNotEmpty,
    ArrayNotEmpty,
    ArrayMinSize,
    ArrayMaxSize, NotEquals, IsDateString, IsEmpty, IsDefined
} from "../../src/decorator/decorators";
import {ValidatorConstraintInterface} from "../../src/validation/ValidatorConstraintInterface";
import {Validator} from "../../src/validation/Validator";

function checkIfValid(object: any) {
    return validator
        .validate(object)
        .then(errors => errors.length.should.be.equal(0));
}

function checkIfInvalid(object: any) {
    return validator
        .validate(object)
        .then(errors => errors.length.should.be.equal(1));
}

function checkValidValues(object: { property: any }, values: any[], done: Function) {
    const promises = values.map(value => {
        object.property = value;
        return checkIfValid(object);
    });
    Promise.all(promises).then(() => done(), err => done(err));
}

function checkInvalidValues(object: { property: any }, values: any[], done: Function) {
    const promises = values.map(value => {
        object.property = value;
        return checkIfInvalid(object);
    });
    Promise.all(promises).then(() => done(), err => done(err));
}

// -------------------------------------------------------------------------
// Setup
// -------------------------------------------------------------------------

let validator: Validator;
beforeEach(() => {
    validator = new Validator();
});

// -------------------------------------------------------------------------
// Specifications
// -------------------------------------------------------------------------

/*
class TestClass {
    name: string;
}

class TestConstraint implements ValidatorConstraintInterface {
    validate(value: any): Promise<boolean> {
        return Promise.resolve(!!value);
    }
}*/
/*describe("ValidatorConstraint", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addConstraintMetadata");
        ValidatorConstraint()(TestClass);
        method.should.have.been.calledWith({
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

describe("ValidateNested", function() {

    it("should add its metadata to metadata storage", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        NestedValidation()(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.NESTED_VALIDATION,
            object: TestClass,
            propertyName: "name",
            groups: undefined,
            message: undefined,
            always: undefined,
            each: undefined
        });
    }));

    it("should be able to set extra metadata options", sinon.test(function() {
        const method = this.mock(defaultMetadataStorage).expects("addValidationMetadata");
        NestedValidation({ always: true, each: true, message: "Error!", groups: ["main"] })(TestClass, "name");
        method.should.have.been.calledWith({
            type: ValidationTypes.NESTED_VALIDATION,
            object: TestClass,
            propertyName: "name",
            groups: ["main"],
            message: "Error!",
            always: true,
            each: true
        });
    }));

});*/

// -------------------------------------------------------------------------
// Specifications: common decorators
// -------------------------------------------------------------------------

describe("IsDefined", function() {

    const validValues = [0, 1, true, false, "", "0", "1234", -1];
    const invalidValues: any[] = [null, undefined];

    class MyClass {
        @IsDefined()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDefined(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDefined(value).should.be.false);
    });

});

describe("Equals", function() {

    const constraint = "Alex";
    const validValues = ["Alex"];
    const invalidValues = ["Alexxx"];

    class MyClass {
        @Equals(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.equals(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.equals(value, constraint).should.be.false);
    });

});

describe("NotEquals", function() {

    const constraint = "Alex";
    const validValues = ["Alexxx"];
    const invalidValues = ["Alex"];

    class MyClass {
        @NotEquals(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.notEquals(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.notEquals(value, constraint).should.be.false);
    });

});

describe("Empty", function() {

    const validValues = [null, undefined, ""];
    const invalidValues = ["0", 0, 1, false, true];

    class MyClass {
        @IsEmpty()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isEmpty(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isEmpty(value).should.be.false);
    });

});

describe("NotEmpty", function() {

    const validValues = ["a", "abc"];
    const invalidValues = ["", undefined, null];

    class MyClass {
        @IsNotEmpty()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isNotEmpty(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isNotEmpty(value).should.be.false);
    });

});

describe("In", function() {

    const constraint = ["foo", "bar"];
    const validValues = ["foo", "bar"];
    const invalidValues = ["foobar", "barfoo", ""];

    class MyClass {
        @IsIn(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isIn(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isIn(value, constraint).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: type check
// -------------------------------------------------------------------------

describe("IsBoolean", function() {

    const validValues = [true, false];
    const invalidValues = [0, 1, "true", null, undefined];

    class MyClass {
        @IsBoolean()
        property: any;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isBoolean(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isBoolean(value).should.be.false);
    });

});

/*describe("IsDecimal", function() {

    const validValues = ["123", "00123", "-00123", "0", "-0", "+123", "0.01", ".1", "1.0", "-.25", "-0", "0.0000000000001"];
    const invalidValues = ["....", " ", "", "-", "+", ".", "0.1a", "a", "\n"];

    class MyClass {
        @IsDecimal()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDecimal(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDecimal(value).should.be.false);
    });

});*/

describe("IsInt", function() {

    const validValues = [2, 4, 100, 1000];
    const invalidValues = [
        "01",
        "-01",
        "000",
        "100e10",
        "123.123",
        "   ",
        "",
        2.5,
        -0.1
    ];

    class MyClass {
        @IsInt()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isInt(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isInt(value as any).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: number check
// -------------------------------------------------------------------------

describe("DivisibleBy", function() {

    const constraint = 2;
    const validValues = [ 2, 4, 100, 1000];
    const invalidValues = ["", undefined, null];

    class MyClass {
        @DivisibleBy(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.divisibleBy(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.divisibleBy(value as any, constraint).should.be.false);
    });

});

describe("IsPositive", function() {

    const validValues = [
        , 3
        , 5000
    ];
    const invalidValues = [
        , "-1"
        , "-2"
        , "0"
        , "1"
        , "2"
        , "3"
        , "4"
        , "5"
        , "6"
        , "7"
        , "8"
        , "9"
        , "100000"
        , -500
        , -123
        , -1
        , "   "
        , ""
    ];

    class MyClass {
        @IsPositive()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isPositive(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isPositive(value as any).should.be.false);
    });

});

describe("IsNegative", function() {

    const validValues = [
        , -3
        , -5000
        , -0.1
    ];
    const invalidValues = [
        , "-1"
        , "-2"
        , "0"
        , "1"
        , "2"
        , "3"
        , "4"
        , "5"
        , "6"
        , "7"
        , "8"
        , "9"
        , "100000"
        , 500
        , 123
        , 1
        , "   "
        , ""
    ];

    class MyClass {
        @IsNegative()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isNegative(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isNegative(value as any).should.be.false);
    });

});

describe("GreaterThen", function() {

    const constraint = 10;
    const validValues = [11, 20, 30, 40];
    const invalidValues = [10, 2, 3, 4, 5, 6, 7, 8, 9, -10];

    class MyClass {
        @GreaterThen(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.greaterThen(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.greaterThen(value, constraint).should.be.false);
    });

});

describe("LessThen", function() {

    const constraint = 10;
    const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, -10];
    const invalidValues = [10, 11, 20, 30, 40];

    class MyClass {
        @LessThen(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.lessThen(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.lessThen(value, constraint).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: date check
// -------------------------------------------------------------------------

describe("MinDate", function() {

    const constraint = new Date(1995, 11, 17);
    const validValues = [new Date()];
    const invalidValues = [new Date(1994, 11, 17)];

    class MyClass {
        @MinDate(constraint)
        property: Date;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.minDate(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.minDate(value, constraint).should.be.false);
    });

});

describe("MaxDate", function() {

    const constraint = new Date(1995, 11, 17);
    const validValues = [new Date(1994, 11, 17)];
    const invalidValues = [new Date()];

    class MyClass {
        @MaxDate(constraint)
        property: Date;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.maxDate(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.maxDate(value, constraint).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: string-as-type check
// -------------------------------------------------------------------------

describe("IsNumberString", function() {

    const validValues = [
        "123"
        , "00123"
        , "-00123"
        , "0"
        , "-0"
        , "+123"
    ];
    const invalidValues = [
        "123.123"
        , " "
        , "."
    ];

    class MyClass {
        @IsNumberString()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isNumberString(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isNumberString(value).should.be.false);
    });

});

describe("IsBooleanString", function() {

    const validValues = [
        "1",
        "0",
        "true",
        "false"
    ];
    const invalidValues = [
        "2",
        "3",
        "falze"
    ];

    class MyClass {
        @IsBooleanString()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isBooleanString(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isBooleanString(value).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: string check
// -------------------------------------------------------------------------

describe("Contains", function() {
    
    const constraint = "hello";
    const validValues = ["hello world"];
    const invalidValues = ["bye world"];

    class MyClass {
        @Contains(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.contains(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.contains(value, constraint).should.be.false);
    });

});

describe("IsAlpha", function() {

    const constraint = "";
    const validValues = ["hellomynameisalex"];
    const invalidValues = ["hello1mynameisalex"];

    class MyClass {
        @IsAlpha(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isAlpha(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isAlpha(value).should.be.false);
    });

});

describe("IsAlphanumeric", function() {

    const constraint = "";
    const validValues = ["hellomyname1salex"];
    const invalidValues = ["hell*mynameisalex"];

    class MyClass {
        @IsAlphanumeric()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isAlphanumeric(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isAlphanumeric(value).should.be.false);
    });

});

describe("IsAscii", function() {

    const constraint = "";
    const validValues = ["hellomyname1salex"];
    const invalidValues = ["hell*mynameisлеха"];

    class MyClass {
        @IsAscii()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isAscii(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isAscii(value).should.be.false);
    });

});

describe("IsBase64", function() {

    const constraint = "";
    const validValues = ["aGVsbG8="];
    const invalidValues = ["hell*mynameisalex"];

    class MyClass {
        @IsBase64()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isBase64(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isBase64(value).should.be.false);
    });

});

describe("IsByteLength", function() {

    const constraint1 = 2;
    const constraint2 = 20;
    const validValues = ["hellostring"];
    const invalidValues = ["helloveryveryveryverylongstring"];

    class MyClass {
        @IsByteLength(constraint1, constraint2)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isByteLength(value, constraint1, constraint2).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isByteLength(value, constraint1, constraint2).should.be.false);
    });

});

describe("IsCreditCard", function() {
    
    const validValues = [
        "375556917985515", 
        "36050234196908",
        "4716461583322103",
        "4716-2210-5188-5662",
        "4929 7226 5379 7141",
        "5398228707871527"
    ];
    const invalidValues = ["foo", "foo", "5398228707871528"];

    class MyClass {
        @IsCreditCard()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isCreditCard(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isCreditCard(value).should.be.false);
    });

});

describe("IsCurrency", function() {
    
    const validValues = [
        "-$10,123.45"
        , "$10,123.45"
        , "$10123.45"
        , "10,123.45"
        , "10123.45"
        , "10,123"
        , "1,123,456"
        , "1123456"
        , "1.39"
        , ".03"
        , "0.10"
        , "$0.10"
        , "-$0.01"
        , "-$.99"
        , "$100,234,567.89"
        , "$10,123"
        , "10,123"
        , "-10123"
    ];
    const invalidValues = [
        "1.234"
        , "$1.1"
        , "$ 32.50"
        , "500$"
        , ".0001"
        , "$.001"
        , "$0.001"
        , "12,34.56"
        , "123456,123,123456"
        , "123,4"
        , ",123"
        , "$-,123"
        , "$"
        , "."
        , ","
        , "00"
        , "$-"
        , "$-,."
        , "-"
        , "-$"
        , ""
        , "- $"
    ];

    class MyClass {
        @IsCurrency()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isCurrency(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isCurrency(value).should.be.false);
    });

});

describe("IsEmail", function() {

    const validValues = [
        "foo@bar.com"
        , "x@x.au"
        , "foo@bar.com.au"
        , "foo+bar@bar.com"
        , "hans.m端ller@test.com"
        , "hans@m端ller.com"
        , "test|123@m端ller.com"
        , "test+ext@gmail.com"
        , "some.name.midd.leNa.me.+extension@GoogleMail.com"
        , "gmail...ignores...dots...@gmail.com"
        , "\"foobar\"@example.com"
        , "\"  foo  m端ller \"@example.com"
        , "\"foo\\@bar\"@example.com"
    ];
    const invalidValues = [
        "invalidemail@"
        , "invalid.com"
        , "@invalid.com"
        , "foo@bar.com."
        , "somename@ｇｍａｉｌ.com"
        , "foo@bar.co.uk."
        , "z@co.c"
        , "ｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌ@gmail.com"
    ];

    class MyClass {
        @IsEmail()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isEmail(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isEmail(value).should.be.false);
    });

});

describe("IsFQDN", function() {

    const validValues = [
        "domain.com"
        , "dom.plato"
        , "a.domain.co"
        , "foo--bar.com"
        , "xn--froschgrn-x9a.com"
        , "rebecca.blackfriday"
    ];
    const invalidValues = [
        "abc"
        , "256.0.0.0"
        , "_.com"
        , "*.some.com"
        , "s!ome.com"
        , "domain.com/"
        , "/more.com"
    ];

    class MyClass {
        @IsFQDN()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isFQDN(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isFQDN(value).should.be.false);
    });

});

describe("IsFullWidth", function() {

    const validValues = [
        "ひらがな・カタカナ、．漢字"
        , "３ー０　ａ＠ｃｏｍ"
        , "Ｆｶﾀｶﾅﾞﾬ"
        , "Good＝Parts"
    ];
    const invalidValues = [
        "abc"
        , "abc123"
    ];

    class MyClass {
        @IsFullWidth()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isFullWidth(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isFullWidth(value).should.be.false);
    });

});

describe("IsHalfWidth", function() {

    const validValues = [
        , "l-btn_02--active"
        , "abc123い"
        , "ｶﾀｶﾅﾞﾬ￩"
    ];
    const invalidValues = [
        "あいうえお"
        , "００１１"
    ];

    class MyClass {
        @IsHalfWidth()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isHalfWidth(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isHalfWidth(value).should.be.false);
    });

});

describe("IsVariableWidth", function() {

    const validValues = [
        "ひらがなカタカナ漢字ABCDE"
        , "３ー０123"
        , "Ｆｶﾀｶﾅﾞﾬ"
        , "Good＝Parts"
    ];
    const invalidValues = [
        "abc"
        , "abc123"
        , "!\"#$%&()<>/+=-_? ~^|.,@`{}[]"
        , "ひらがな・カタカナ、．漢字"
        , "１２３４５６"
        , "ｶﾀｶﾅﾞﾬ"
    ];

    class MyClass {
        @IsVariableWidth()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isVariableWidth(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isVariableWidth(value).should.be.false);
    });

});

describe("IsHexColor", function() {

    const validValues = [
        "#ff0034"
        , "#CCCCCC"
        , "fff"
        , "#f00"
    ];
    const invalidValues = [
        "#ff"
        , "fff0"
        , "#ff12FG"
    ];

    class MyClass {
        @IsHexColor()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isHexColor(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isHexColor(value).should.be.false);
    });

});

describe("IsHexadecimal", function() {

    const validValues = [
        "deadBEEF"
        , "ff0044"
    ];
    const invalidValues = [
        "abcdefg"
        , ""
        , ".."
    ];

    class MyClass {
        @IsHexadecimal()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isHexadecimal(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isHexadecimal(value).should.be.false);
    });

});

describe("IsIP", function() {

    const validValues = [
        "127.0.0.1"
        , "0.0.0.0"
        , "255.255.255.255"
        , "1.2.3.4"
        , "::1"
        , "2001:db8:0000:1:1:1:1:1"
        , "2001:41d0:2:a141::1"
        , "::ffff:127.0.0.1"
        , "::0000"
        , "0000::"
        , "1::"
        , "1111:1:1:1:1:1:1:1"
        , "fe80::a6db:30ff:fe98:e946"
        , "::"
        , "::ffff:127.0.0.1"
        , "0:0:0:0:0:ffff:127.0.0.1"
    ];
    const invalidValues = [
        "abc"
        , "256.0.0.0"
        , "0.0.0.256"
        , "26.0.0.256"
        , "::banana"
        , "banana::"
        , "::1banana"
        , "::1::"
        , "1:"
        , ":1"
        , ":1:1:1::2"
        , "1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1"
        , "::11111"
        , "11111:1:1:1:1:1:1:1"
        , "2001:db8:0000:1:1:1:1::1"
        , "0:0:0:0:0:0:ffff:127.0.0.1"
        , "0:0:0:0:ffff:127.0.0.1"
    ];

    class MyClass {
        @IsIP()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isIP(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isIP(value).should.be.false);
    });

});

describe("IsISBN version 10", function() {

    const validValues = [
        "3836221195", "3-8362-2119-5", "3 8362 2119 5"
        , "1617290858", "1-61729-085-8", "1 61729 085-8"
        , "0007269706", "0-00-726970-6", "0 00 726970 6"
        , "3423214120", "3-423-21412-0", "3 423 21412 0"
        , "340101319X", "3-401-01319-X", "3 401 01319 X"
    ];
    const invalidValues = [
        "3423214121", "3-423-21412-1", "3 423 21412 1"
        , "978-3836221191", "9783836221191"
        , "123456789a", "foo"
    ];

    class MyClass {
        @IsISBN("10")
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isISBN(value, "10").should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isISBN(value, "10").should.be.false);
    });

});

describe("IsISBN version 13", function() {

    const validValues = [
        "9783836221191", "978-3-8362-2119-1", "978 3 8362 2119 1"
        , "9783401013190", "978-3401013190", "978 3401013190"
        , "9784873113685", "978-4-87311-368-5", "978 4 87311 368 5"
    ];
    const invalidValues = [
        "9783836221190", "978-3-8362-2119-0", "978 3 8362 2119 0"
        , "3836221195", "3-8362-2119-5", "3 8362 2119 5"
        , "01234567890ab", "foo", ""
    ];

    class MyClass {
        @IsISBN("13")
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isISBN(value, "13").should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isISBN(value, "13").should.be.false);
    });

});

describe("IsISO8601", function() {

    const validValues = [
        "2009-12T12:34"
        , "2009"
        , "2009-05-19"
        , "2009-05-19"
        , "20090519"
        , "2009123"
        , "2009-05"
        , "2009-123"
        , "2009-222"
        , "2009-001"
        , "2009-W01-1"
        , "2009-W51-1"
        , "2009-W511"
        , "2009-W33"
        , "2009W511"
        , "2009-05-19"
        , "2009-05-19 00:00"
        , "2009-05-19 14"
        , "2009-05-19 14:31"
        , "2009-05-19 14:39:22"
        , "2009-05-19T14:39Z"
        , "2009-W21-2"
        , "2009-W21-2T01:22"
        , "2009-139"
        , "2009-05-19 14:39:22-06:00"
        , "2009-05-19 14:39:22+0600"
        , "2009-05-19 14:39:22-01"
        , "20090621T0545Z"
        , "2007-04-06T00:00"
        , "2007-04-05T24:00"
        , "2010-02-18T16:23:48.5"
        , "2010-02-18T16:23:48,444"
        , "2010-02-18T16:23:48,3-06:00"
        , "2010-02-18T16:23.4"
        , "2010-02-18T16:23,25"
        , "2010-02-18T16:23.33+0600"
        , "2010-02-18T16.23334444"
        , "2010-02-18T16,2283"
        , "2009-05-19 143922.500"
        , "2009-05-19 1439,55"
    ];
    const invalidValues = [
        "200905"
        , "2009367"
        , "2009-"
        , "2007-04-05T24:50"
        , "2009-000"
        , "2009-M511"
        , "2009M511"
        , "2009-05-19T14a39r"
        , "2009-05-19T14:3924"
        , "2009-0519"
        , "2009-05-1914:39"
        , "2009-05-19 14:"
        , "2009-05-19r14:39"
        , "2009-05-19 14a39a22"
        , "200912-01"
        , "2009-05-19 14:39:22+06a00"
        , "2009-05-19 146922.500"
        , "2010-02-18T16.5:23.35:48"
        , "2010-02-18T16:23.35:48"
        , "2010-02-18T16:23.35:48.45"
        , "2009-05-19 14.5.44"
        , "2010-02-18T16:23.33.600"
        , "2010-02-18T16,25:23:48,444"
    ];

    class MyClass {
        @IsISO8601()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isISO8601(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isISO8601(value).should.be.false);
    });

});

describe("IsJSON", function() {

    const validValues = ["{ \"key\": \"value\" }", "{}"];
    const invalidValues = ["{ key: \"value\" }", "{ 'key': 'value' }", "null", "1234", "false", "\"nope\""];

    class MyClass {
        @IsJSON()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isJSON(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isJSON(value).should.be.false);
    });

});

describe("IsLowercase", function() {

    const validValues = [
        "abc"
        , "abc123"
        , "this is lowercase."
        , "tr竪s 端ber"
    ];
    const invalidValues = [
        "fooBar"
        , "123A"
    ];

    class MyClass {
        @IsLowercase()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isLowercase(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isLowercase(value).should.be.false);
    });

});

describe("IsMongoId", function() {

    const validValues = [
        "507f1f77bcf86cd799439011"
    ];
    const invalidValues = [
        "507f1f77bcf86cd7994390"
        , "507f1f77bcf86cd79943901z"
        , ""
        , "507f1f77bcf86cd799439011 "
    ];

    class MyClass {
        @IsMongoId()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isMongoId(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isMongoId(value).should.be.false);
    });

});

describe("IsMultibyte", function() {

    const validValues = [
        "ひらがな・カタカナ、．漢字"
        , "あいうえお foobar"
        , "test＠example.com"
        , "1234abcDEｘｙｚ"
        , "ｶﾀｶﾅ"
        , "中文"
    ];
    const invalidValues = [
        "abc"
        , "abc123"
        , "<>@\" *."
    ];

    class MyClass {
        @IsMultibyte()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isMultibyte(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isMultibyte(value).should.be.false);
    });

});

describe("IsSurrogatePair", function() {

    const validValues = [
        "𠮷野𠮷"
        , "𩸽"
        , "ABC千𥧄1-2-3"
    ];
    const invalidValues = [
        "吉野竈"
        , "鮪"
        , "ABC1-2-3"
    ];

    class MyClass {
        @IsSurrogatePair()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isSurrogatePair(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isSurrogatePair(value).should.be.false);
    });

});

describe("IsUrl", function() {

    const validValues = [
        "foobar.com"
        , "www.foobar.com"
        , "foobar.com/"
        , "valid.au"
        , "http://www.foobar.com/"
        , "http://www.foobar.com:23/"
        , "http://www.foobar.com:65535/"
        , "http://www.foobar.com:5/"
        , "https://www.foobar.com/"
        , "ftp://www.foobar.com/"
        , "http://www.foobar.com/~foobar"
        , "http://user:pass@www.foobar.com/"
        , "http://user:@www.foobar.com/"
        , "http://127.0.0.1/"
        , "http://10.0.0.0/"
        , "http://189.123.14.13/"
        , "http://duckduckgo.com/?q=%2F"
        , "http://foobar.com/t$-_.+!*\"(),"
        , "http://localhost:3000/"
        , "http://foobar.com/?foo=bar#baz=qux"
        , "http://foobar.com?foo=bar"
        , "http://foobar.com#baz=qux"
        , "http://www.xn--froschgrn-x9a.net/"
        , "http://xn--froschgrn-x9a.com/"
        , "http://foo--bar.com"
        , "http://høyfjellet.no"
        , "http://xn--j1aac5a4g.xn--j1amh"
    ];
    const invalidValues = [
        "xyz://foobar.com"
        , "invalid/"
        , "invalid.x"
        , "invalid."
        , ".com"
        , "http://com/"
        , "http://300.0.0.1/"
        , "mailto:foo@bar.com"
        , "rtmp://foobar.com"
        , "http://www.xn--.com/"
        , "http://xn--.com/"
        , "http://www.foobar.com:0/"
        , "http://www.foobar.com:70000/"
        , "http://www.foobar.com:99999/"
        , "http://www.-foobar.com/"
        , "http://www.foobar-.com/"
        , "http://foobar/# lol"
        , "http://foobar/? lol"
        , "http://foobar/ lol/"
        , "http://lol @foobar.com/"
        , "http://lol:lol @foobar.com/"
        , "http://lol:lol:lol@foobar.com/"
        , "http://lol: @foobar.com/"
        , "http://www.foo_bar.com/"
        , "http://www.foobar.com/\t"
        , "http://\n@www.foobar.com/"
        , ""
        , "http://foobar.com/" + new Array(2083).join("f")
        , "http://*.foo.com"
        , "*.foo.com"
        , "!.foo.com"
        , "http://example.com."
        , "http://localhost:61500this is an invalid url!!!!"
        , "////foobar.com"
        , "http:////foobar.com"
    ];

    class MyClass {
        @IsUrl()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isURL(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isURL(value).should.be.false);
    });

});

describe("IsUUID", function() {

    const validValues = [
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
    ];
    const invalidValues = [
        ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx"
        , "A987FBC94BED3078CF079141BA07C9F3"
        , "934859"
        , "987FBC9-4BED-3078-CF07A-9141BA07C9F3"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
    ];

    class MyClass {
        @IsUUID()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isUUID(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isUUID(value).should.be.false);
    });

});

describe("IsUUID v3", function() {

    const validValues = [
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
    ];
    const invalidValues = [
        ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
    ];

    class MyClass {
        @IsUUID("3")
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isUUID(value, "3").should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isUUID(value, "3").should.be.false);
    });

});

describe("IsUUID v4", function() {

    const validValues = [
        "713ae7e3-cb32-45f9-adcb-7c4fa86b90c1"
        , "625e63f3-58f5-40b7-83a1-a72ad31acffb"
        , "57b73598-8764-4ad0-a76a-679bb6640eb1"
        , "9c858901-8a57-4791-81fe-4c455b099bc9"
    ];
    const invalidValues = [
        ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
    ];

    class MyClass {
        @IsUUID("4")
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isUUID(value, "4").should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isUUID(value, "4").should.be.false);
    });

});

describe("IsUUID v5", function() {

    const validValues = [
        "987FBC97-4BED-5078-AF07-9141BA07C9F3"
        , "987FBC97-4BED-5078-BF07-9141BA07C9F3"
        , "987FBC97-4BED-5078-8F07-9141BA07C9F3"
        , "987FBC97-4BED-5078-9F07-9141BA07C9F3"
    ];
    const invalidValues = [
        ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "9c858901-8a57-4791-81fe-4c455b099bc9"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
    ];

    class MyClass {
        @IsUUID("5")
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isUUID(value, "5").should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isUUID(value, "5").should.be.false);
    });

});

describe("IsUppercase", function() {

    const validValues = [
        "ABC"
        , "ABC123"
        , "ALL CAPS IS FUN."
        , "   ."
    ];
    const invalidValues = [
        "fooBar"
        , "123abc"
    ];

    class MyClass {
        @IsUppercase()
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isUppercase(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isUppercase(value).should.be.false);
    });

});

describe("Length", function() {

    const constraint1 = 2;
    const constraint2 = 3;
    const validValues = ["abc", "de"];
    const invalidValues = ["", "a", "abcd"];

    class MyClass {
        @Length(constraint1, constraint2)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.length(value, constraint1, constraint2).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.length(value, constraint1, constraint2).should.be.false);
    });

});

describe("MinLength", function() {

    const constraint1 = 10;
    const validValues = ["helloworld", "hello how are you"];
    const invalidValues = ["hellowar", "howareyou"];

    class MyClass {
        @MinLength(constraint1)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.minLength(value, constraint1).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.minLength(value, constraint1).should.be.false);
    });

});

describe("MaxLength", function() {

    const constraint1 = 10;
    const validValues = ["hellowar", "howareyou", "helloworld"];
    const invalidValues = ["helloworld!", "hello how are you"];

    class MyClass {
        @MaxLength(constraint1)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.maxLength(value, constraint1).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.maxLength(value, constraint1).should.be.false);
    });

});

describe("Matches", function() {

    const constraint = /abc/;
    const validValues = ["abc", "abcdef", "123abc"];
    const invalidValues = ["acb", "Abc"];

    class MyClass {
        @Matches(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.matches(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.matches(value, constraint).should.be.false);
    });

});

// -------------------------------------------------------------------------
// Specifications: array check
// -------------------------------------------------------------------------

describe("ArrayNotEmpty", function() {

    class MyClass {
        @ArrayNotEmpty()
        tags: string[];
    }

    it("should not fail if validator.validate said that its valid", function() {
        const object = new MyClass();
        object.tags = ["world"];
        return checkIfValid(object);
    });

    it("should fail if validator.validate said that its invalid", function() {
        const object = new MyClass();
        object.tags = [];
        return checkIfInvalid(object);
    });

});


describe("ArrayMinSize", function() {

    const constraint = 2;
    const validValues = [["world", "hello"]];
    const invalidValues = [["hi"]];

    class MyClass {
        @ArrayMinSize(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.arrayMinSize(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.arrayMinSize(value, constraint).should.be.false);
    });

});

describe("ArrayMaxSize", function() {

    const constraint = 2;
    const validValues = [["world", "hello"]];
    const invalidValues = [["hi", "hello", "javascript"]];

    class MyClass {
        @ArrayMaxSize(constraint)
        property: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.arrayMaxSize(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.arrayMaxSize(value, constraint).should.be.false);
    });

});