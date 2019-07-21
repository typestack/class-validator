import "es6-shim";
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
    IsDecimal,
    IsBase64,
    IsBoolean,
    IsByteLength,
    IsCreditCard,
    IsCurrency,
    IsDate,
    IsDivisibleBy,
    IsEmail,
    IsEnum,
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
    IsMilitaryTime,
    ArrayNotEmpty,
    ArrayMinSize,
    ArrayMaxSize,
    NotEquals,
    IsEmpty,
    IsDefined,
    IsNotIn,
    IsNumber,
    IsString,
    NotContains,
    ArrayContains,
    ArrayNotContains,
    ArrayUnique,
    IsArray,
    IsDateString,
    IsInstance,
    IsPhoneNumber,
    IsISO31661Alpha2,
    IsISO31661Alpha3,
} from "../../src/decorator/decorators";
import {Validator} from "../../src/validation/Validator";
import {ValidatorOptions} from "../../src/validation/ValidatorOptions";

import {should, use } from "chai";

import * as chaiAsPromised from "chai-as-promised";
import IsDecimalOptions = ValidatorJS.IsDecimalOptions;

should();
use(chaiAsPromised);

// -------------------------------------------------------------------------
// Helper functions
// -------------------------------------------------------------------------

export function checkValidValues(object: { someProperty: any }, values: any[], done: Function, validatorOptions?: ValidatorOptions) {
    const validator = new Validator();
    const promises = values.map(value => {
        object.someProperty = value;
        return validator
            .validate(object, validatorOptions)
            .then(errors => errors.length.should.be.equal(0, `Unexpected errors: ${JSON.stringify(errors)}`));
    });
    Promise.all(promises).then(() => done(), err => done(err));
}

export function checkInvalidValues(object: { someProperty: any }, values: any[], done: Function, validatorOptions?: ValidatorOptions) {
    const validator = new Validator();
    const promises = values.map(value => {
        object.someProperty = value;
        return validator
            .validate(object, validatorOptions)
            .then(errors => errors.length.should.be.equal(1));
    });
    Promise.all(promises).then(() => done(), err => done(err));
}

export function checkReturnedError(object: { someProperty: any },
                                   values: any[],
                                   validationType: string,
                                   message: string,
                                   done: Function,
                                   validatorOptions?: ValidatorOptions) {

    const validator = new Validator();
    const promises = values.map(value => {
        object.someProperty = value;
        return validator
            .validate(object, validatorOptions)
            .then(errors => {
                errors.length.should.be.equal(1);
                errors[0].target.should.be.equal(object);
                errors[0].property.should.be.equal("someProperty");
                errors[0].constraints.should.be.eql({ [validationType]: message });
                expect(errors[0].value).to.be.equal(value);
            });
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

describe("IsDefined", function() {

    const validValues = [0, 1, true, false, "", "0", "1234", -1];
    const invalidValues: any[] = [null, undefined];

    class MyClass {
        @IsDefined()
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if validator.validate said that its valid with skipMissingProperties set to true", function(done) {
        checkValidValues(new MyClass(), validValues, done, { skipMissingProperties: true });
    });

    it("should fail if validator.validate said that its invalid with skipMissingProperties set to true", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done, { skipMissingProperties: true });
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDefined(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDefined(value).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isDefined";
        const message = "someProperty should not be null or undefined";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("Equals", function() {

    const constraint = "Alex";
    const validValues = ["Alex"];
    const invalidValues = ["Alexxx"];

    class MyClass {
        @Equals(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "equals";
        const message = "someProperty must be equal to " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("NotEquals", function() {

    const constraint = "Alex";
    const validValues = ["Alexxx"];
    const invalidValues = ["Alex"];

    class MyClass {
        @NotEquals(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "notEquals";
        const message = "someProperty should not be equal to " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsEmpty", function() {

    const validValues = [null, undefined, ""];
    const invalidValues = ["0", 0, 1, false, true];

    class MyClass {
        @IsEmpty()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isEmpty";
        const message = "someProperty must be empty";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsNotEmpty", function() {

    const validValues = ["a", "abc"];
    const invalidValues = ["", undefined, null];

    class MyClass {
        @IsNotEmpty()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isNotEmpty";
        const message = "someProperty should not be empty";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsIn", function() {

    const constraint = ["foo", "bar"];
    const validValues = ["foo", "bar"];
    const invalidValues = ["foobar", "barfoo", ""];

    class MyClass {
        @IsIn(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isIn";
        const message = "someProperty must be one of the following values: " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsNotIn", function() {

    const constraint = ["foo", "bar"];
    const validValues = ["foobar", "barfoo", ""];
    const invalidValues = ["foo", "bar"];

    class MyClass {
        @IsNotIn(constraint)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isNotIn(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isNotIn(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isNotIn";
        const message = "someProperty should not be one of the following values: " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        someProperty: any;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isBoolean";
        const message = "someProperty must be a boolean value";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsDate", function() {

    const validValues = [new Date()];
    const invalidValues = [1, true, false, "Mon Aug 17 2015 00:24:56 GMT-0500 (CDT)", "2009-05-19 14:39:22-06:00"];

    class MyClass {
        @IsDate()
        someProperty: Date;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDate(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDate(value).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isDate";
        const message = "someProperty must be a Date instance";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsNumber", function() {

    const validValues = [0, 1, 2, 3, 4, 5.4, -10];
    const invalidValues = ["1", "0", true, false, "-100", "abc", undefined, null];

    class MyClass {
        @IsNumber()
        someProperty: number;
    }

    class NaNTestClass {
        @IsNumber({ allowNaN: true })
        someProperty: number;
    }

    class InfinityTestClass {
        @IsNumber({ allowInfinity: true })
        someProperty: number;
    }

    it("should fail if NaN passed without allowing NaN values", function (done) {
        checkInvalidValues(new MyClass(), [NaN], done);
    });

    it("should fail if Infinity passed without allowing NaN values", function (done) {
        checkInvalidValues(new MyClass(), [Infinity, -Infinity], done);
    });

    it("should not fail if NaN passed and NaN as value is allowed", function (done) {
        checkValidValues(new NaNTestClass(), [NaN], done);
    });

    it("should not fail if Infinity passed and Infinity as value is allowed", function (done) {
        checkValidValues(new InfinityTestClass(), [Infinity, -Infinity], done);
    });

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isNumber(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isNumber(value).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isNumber";
        const message = "someProperty must be a number";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isInt";
        const message = "someProperty must be an integer number";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsString", function() {

    const validValues = ["true", "false", "hello", "0", "", "1"];
    const invalidValues = [
        true,
        false,
        1,
        2,
        null,
        undefined
    ];

    class MyClass {
        @IsString()
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isString(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isString(value as any).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isString";
        const message = "someProperty must be a string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsDateString", function() {

    const validValues = [
        "2017-06-06T17:04:42.081Z",
        "2017-06-06T17:04:42.081",
        "2018-01-04T08:15:30",
        "2018-01-04T08:15:30Z",
        "2018-01-04T08:15:30+04:00",
        "2018-01-04T08:15:30+04",
    ];
    const invalidValues = [
        true,
        false,
        1,
        2,
        null,
        undefined,
        "text",
        "text2018-01-04T08:15:30+04",
        "2018-01-04T08:15:30Ztext",
    ];

    class MyClass {
        @IsDateString()
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => expect(validator.isDateString(value)).be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => expect(validator.isDateString(value as any)).be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isDateString";
        // const message = "someProperty deve ser um texto de data";
        const message = "someProperty must be a ISOString";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsArray", function() {

    const validValues = [[], [1, 2, 3], [0, 0, 0], [""], [0], [undefined], [{}], new Array()];
    const invalidValues = [
        true,
        false,
        1,
        {},
        null,
        undefined
    ];

    class MyClass {
        @IsArray()
        someProperty: string[];
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isArray(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isArray(value as any).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isArray";
        const message = "someProperty must be an array";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});


describe("IsEnum", function() {

    enum MyEnum {
        First   = 1,
        Second  = 999
    }

    enum MyStringEnum {
        First   = <any>"first",
        Second  = <any>"second"
    }

    const validValues = [MyEnum.First, MyEnum.Second];
    const validStringValues = [MyStringEnum.First, MyStringEnum.Second];
    const invalidValues = [
        true,
        false,
        0,
        {},
        null,
        undefined,
        "F2irst"
    ];

    class MyClass {
        @IsEnum(MyEnum)
        someProperty: MyEnum;
    }

    class MyClass2 {
        @IsEnum(MyStringEnum)
        someProperty: MyStringEnum;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should not fail if validator.validate said that its valid (string enum)", function(done) {
        checkValidValues(new MyClass2(), validStringValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should fail if validator.validate said that its invalid (string enum)", function(done) {
        checkInvalidValues(new MyClass2(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isEnum(value, MyEnum).should.be.true);
    });

    it("should not fail if method in validator said that its valid (string enum)", function() {
        validStringValues.forEach(value => validator.isEnum(value, MyStringEnum).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isEnum(value, MyEnum).should.be.false);
    });

    it("should fail if method in validator said that its invalid (string enum)", function() {
        invalidValues.forEach(value => validator.isEnum(value, MyStringEnum).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isEnum";
        const message = "someProperty must be a valid enum value";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

    it("should return error object with proper data (string enum)", function(done) {
        const validationType = "isEnum";
        const message = "someProperty must be a valid enum value";
        checkReturnedError(new MyClass2(), invalidValues, validationType, message, done);
    });

});


// -------------------------------------------------------------------------
// Specifications: number check
// -------------------------------------------------------------------------

describe("IsDivisibleBy", function() {

    const constraint = 2;
    const validValues = [ 2, 4, 100, 1000];
    const invalidValues = ["", undefined, null];

    class MyClass {
        @IsDivisibleBy(constraint)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDivisibleBy(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDivisibleBy(value as any, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isDivisibleBy";
        const message = "someProperty must be divisible by " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isPositive";
        const message = "someProperty must be a positive number";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isNegative";
        const message = "someProperty must be a negative number";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("Min", function() {

    const constraint = 10;
    const validValues = [10, 11, 20, 30, 40];
    const invalidValues = [2, 3, 4, 5, 6, 7, 8, 9, -10];

    class MyClass {
        @Min(constraint)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.min(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.min(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "min";
        const message = "someProperty must not be less than " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("Max", function() {

    const constraint = 10;
    const validValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, -10, 10];
    const invalidValues = [11, 20, 30, 40];

    class MyClass {
        @Max(constraint)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.max(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.max(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "max";
        const message = "someProperty must not be greater than " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        someProperty: Date;
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

    it("should return error object with proper data", function(done) {
        const validationType = "minDate";
        const message = "minimal allowed date for someProperty is " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("MaxDate", function() {

    const constraint = new Date(1995, 11, 17);
    const validValues = [new Date(1994, 11, 17)];
    const invalidValues = [new Date()];

    class MyClass {
        @MaxDate(constraint)
        someProperty: Date;
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

    it("should return error object with proper data", function(done) {
        const validationType = "maxDate";
        const message = "maximal allowed date for someProperty is " + constraint;
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

// -------------------------------------------------------------------------
// Specifications: string-as-type check
// -------------------------------------------------------------------------

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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isBooleanString";
        const message = "someProperty must be a boolean string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsNumberString", function() {

    const validValues = [
        "123"
        , "123.123"
        , "00123"
        , "-00123"
        , "0"
        , "-0"
        , "+123"
    ];
    const invalidValues = [
        " "
        , "."
    ];

    class MyClass {
        @IsNumberString()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isNumberString";
        const message = "someProperty must be a number string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

// -------------------------------------------------------------------------
// Specifications: string check
// -------------------------------------------------------------------------

describe("Contains", function() {

    const constraint = "hello";
    const validValues = ["hello world"];
    const invalidValues = [null, undefined, "bye world"];

    class MyClass {
        @Contains(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "contains";
        const message = "someProperty must contain a " + constraint +  " string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("NotContains", function() {

    const constraint = "hello";
    const validValues = ["bye world"];
    const invalidValues = [null, undefined, "hello world"];

    class MyClass {
        @NotContains(constraint)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.notContains(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.notContains(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "notContains";
        const message = "someProperty should not contain a " + constraint +  " string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsAlpha", function() {

    const constraint = "";
    const validValues = ["hellomynameisalex"];
    const invalidValues = [null, undefined, "hello1mynameisalex"];

    class MyClass {
        @IsAlpha()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isAlpha";
        const message = "someProperty must contain only letters (a-zA-Z)";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsAlphanumeric", function() {

    const constraint = "";
    const validValues = ["hellomyname1salex"];
    const invalidValues = [null, undefined, "hell*mynameisalex"];

    class MyClass {
        @IsAlphanumeric()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isAlphanumeric";
        const message = "someProperty must contain only letters and numbers";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsAscii", function() {

    const constraint = "";
    const validValues = ["hellomyname1salex"];
    const invalidValues = [null, undefined, "hell*mynameisлеха"];

    class MyClass {
        @IsAscii()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isAscii";
        const message = "someProperty must contain only ASCII characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsDecimal", function() {

    const validValues = [
        "100.0",
        "100.1",
        "100.3",
        "100.4",
        "100.5",
        "100.6",
        "100.7",
        "100.8",
        "100.9",
        "1.9",
        "-1.9",
        "-124.1"
    ];

    const invalidValues = [
        null,
        undefined,
        "hello",
        "",
        "1",
        "1.",
        "1,",
        "-1",
        "100",
        "100,100",
        "100.23",
        "100.214141",
        "100,23",
        "100,2143192"
    ];

    const IsDecimalOptions: IsDecimalOptions = {
        force_decimal: true,
        decimal_digits: "1",
        locale: "en-US"
    };

    class MyClass {
        @IsDecimal(IsDecimalOptions)
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isDecimal(value, IsDecimalOptions).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isDecimal(value, IsDecimalOptions).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isDecimal";
        const message = "someProperty is not a valid decimal number.";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});
describe("IsBase64", function() {

    const constraint = "";
    const validValues = ["aGVsbG8="];
    const invalidValues = [null, undefined, "hell*mynameisalex"];

    class MyClass {
        @IsBase64()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isBase64";
        const message = "someProperty must be base64 encoded";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsByteLength", function() {

    const constraint1 = 2;
    const constraint2 = 20;
    const validValues = ["hellostring"];
    const invalidValues = [null, undefined, "helloveryveryveryverylongstring"];

    class MyClass {
        @IsByteLength(constraint1, constraint2)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isByteLength";
        const message = "someProperty's byte length must fall into (" + constraint1 + ", " + constraint2 + ") range";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
    const invalidValues = [null, undefined, "foo", "foo", "5398228707871528"];

    class MyClass {
        @IsCreditCard()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isCreditCard";
        const message = "someProperty must be a credit card";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "1.234"
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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isCurrency";
        const message = "someProperty must be a currency";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        , "\"foobar\"@example.com"
        , "\"  foo  m端ller \"@example.com"
        , "\"foo\\@bar\"@example.com"
    ];
    const invalidValues = [
        null
        , undefined
        , "invalidemail@"
        , "invalid.com"
        , "@invalid.com"
        , "foo@bar.com."
        , "somename@ｇｍａｉｌ.com"
        , "foo@bar.co.uk."
        , "z@co.c"
        , "gmail...ignores...dots...@gmail.com"
        , "ｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌｇｍａｉｌ@gmail.com"
    ];

    class MyClass {
        @IsEmail()
        someProperty: string;
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => {
            console.log(value, validator.isEmail(value));
            return validator.isEmail(value).should.be.true;
        });
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isEmail(value).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isEmail";
        const message = "someProperty must be an email";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "abc"
        , "256.0.0.0"
        , "_.com"
        , "*.some.com"
        , "s!ome.com"
        , "domain.com/"
        , "/more.com"
    ];

    class MyClass {
        @IsFQDN()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isFqdn";
        const message = "someProperty must be a valid domain name";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "abc"
        , "abc123"
    ];

    class MyClass {
        @IsFullWidth()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isFullWidth";
        const message = "someProperty must contain a full-width characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsHalfWidth", function() {

    const validValues = [
        , "l-btn_02--active"
        , "abc123い"
        , "ｶﾀｶﾅﾞﾬ￩"
    ];
    const invalidValues = [
        null
        , undefined
        , "あいうえお"
        , "００１１"
    ];

    class MyClass {
        @IsHalfWidth()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isHalfWidth";
        const message = "someProperty must contain a half-width characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "abc"
        , "abc123"
        , "!\"#$%&()<>/+=-_? ~^|.,@`{}[]"
        , "ひらがな・カタカナ、．漢字"
        , "１２３４５６"
        , "ｶﾀｶﾅﾞﾬ"
    ];

    class MyClass {
        @IsVariableWidth()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isVariableWidth";
        const message = "someProperty must contain a full-width and half-width characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "#ff"
        , "fff0"
        , "#ff12FG"
    ];

    class MyClass {
        @IsHexColor()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isHexColor";
        const message = "someProperty must be a hexadecimal color";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsHexadecimal", function() {

    const validValues = [
        "deadBEEF"
        , "ff0044"
    ];
    const invalidValues = [
        null
        , undefined
        , "abcdefg"
        , ""
        , ".."
    ];

    class MyClass {
        @IsHexadecimal()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isHexadecimal";
        const message = "someProperty must be a hexadecimal number";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "abc"
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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isIp";
        const message = "someProperty must be an ip address";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null, undefined, "3423214121", "3-423-21412-1", "3 423 21412 1"
        , "978-3836221191", "9783836221191"
        , "123456789a", "foo"
    ];

    class MyClass {
        @IsISBN("10")
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isIsbn";
        const message = "someProperty must be an ISBN";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsISBN version 13", function() {

    const validValues = [
        "9783836221191", "978-3-8362-2119-1", "978 3 8362 2119 1"
        , "9783401013190", "978-3401013190", "978 3401013190"
        , "9784873113685", "978-4-87311-368-5", "978 4 87311 368 5"
    ];
    const invalidValues = [
        null, undefined, "9783836221190", "978-3-8362-2119-0", "978 3 8362 2119 0"
        , "3836221195", "3-8362-2119-5", "3 8362 2119 5"
        , "01234567890ab", "foo", ""
    ];

    class MyClass {
        @IsISBN("13")
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isIsbn";
        const message = "someProperty must be an ISBN";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "200905"
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
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isIso8601";
        const message = "someProperty must be a valid ISO 8601 date string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsJSON", function() {

    const validValues = ["{ \"key\": \"value\" }", "{}"];
    const invalidValues = [null, undefined, "{ key: \"value\" }", "{ 'key': 'value' }", "null", "1234", "false", "\"nope\""];

    class MyClass {
        @IsJSON()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isJson";
        const message = "someProperty must be a json string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "fooBar"
        , "123A"
    ];

    class MyClass {
        @IsLowercase()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isLowercase";
        const message = "someProperty must be a lowercase string";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsMongoId", function() {

    const validValues = [
        "507f1f77bcf86cd799439011"
    ];
    const invalidValues = [
        null
        , undefined
        , "507f1f77bcf86cd7994390"
        , "507f1f77bcf86cd79943901z"
        , ""
        , "507f1f77bcf86cd799439011 "
    ];

    class MyClass {
        @IsMongoId()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isMongoId";
        const message = "someProperty must be a mongodb id";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "abc"
        , "abc123"
        , "<>@\" *."
    ];

    class MyClass {
        @IsMultibyte()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isMultibyte";
        const message = "someProperty must contain one or more multibyte chars";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsSurrogatePair", function() {

    const validValues = [
        "𠮷野𠮷"
        , "𩸽"
        , "ABC千𥧄1-2-3"
    ];
    const invalidValues = [
        null
        , undefined
        , "吉野竈"
        , "鮪"
        , "ABC1-2-3"
    ];

    class MyClass {
        @IsSurrogatePair()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isSurrogatePair";
        const message = "someProperty must contain any surrogate pairs chars";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , "xyz://foobar.com"
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
        , "http://localhost:61500this is an invalid url!!!!"
        , "http://foobar.com/" + new Array(2083).join("f")
        , "http://*.foo.com"
        , "*.foo.com"
        , "!.foo.com"
        , "http://example.com."
        , "////foobar.com"
        , "http:////foobar.com"
    ];

    class MyClass {
        @IsUrl()
        someProperty: string;
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

    it("should fail on localhost without require_tld option", function () {
        validator.isURL("http://localhost:3000/").should.be.false;
    });

    it("should pass on localhost with require_tld option", function () {
        validator.isURL("http://localhost:3000/", { require_tld: false }).should.be.true;
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isUrl";
        const message = "someProperty must be an URL address";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsUUID", function() {

    const validValues = [
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
    ];
    const invalidValues = [
        null
        , undefined
        , ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3xxx"
        , "A987FBC94BED3078CF079141BA07C9F3"
        , "934859"
        , "987FBC9-4BED-3078-CF07A-9141BA07C9F3"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
    ];

    class MyClass {
        @IsUUID()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isUuid";
        const message = "someProperty must be an UUID";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsUUID v3", function() {

    const validValues = [
        "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
    ];
    const invalidValues = [
        null
        , undefined
        , ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "A987FBC9-4BED-4078-8F07-9141BA07C9F3"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
    ];

    class MyClass {
        @IsUUID("3")
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isUuid";
        const message = "someProperty must be an UUID";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "A987FBC9-4BED-5078-AF07-9141BA07C9F3"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3"
    ];

    class MyClass {
        @IsUUID("4")
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isUuid";
        const message = "someProperty must be an UUID";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null
        , undefined
        , ""
        , "xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3"
        , "934859"
        , "AAAAAAAA-1111-1111-AAAG-111111111111"
        , "9c858901-8a57-4791-81fe-4c455b099bc9"
        , "A987FBC9-4BED-3078-CF07-9141BA07C9F3",
    ];

    class MyClass {
        @IsUUID("5")
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isUuid";
        const message = "someProperty must be an UUID";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
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
        null,
        undefined,
        "fooBar",
        "123abc"
    ];

    class MyClass {
        @IsUppercase()
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "isUppercase";
        const message = "someProperty must be uppercase";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("Length", function() {

    const constraint1 = 2;
    const constraint2 = 3;
    const validValues = ["abc", "de"];
    const invalidValues = [null, undefined, "", "a", "abcd"];

    class MyClass {
        @Length(constraint1, constraint2)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "length";
        const message = "someProperty must be longer than or equal to " + constraint1 + " characters";
        checkReturnedError(new MyClass(), ["", "a"], validationType, message, done);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "length";
        const message = "someProperty must be shorter than or equal to " + constraint2 + " characters";
        checkReturnedError(new MyClass(), ["aaaa", "azzazza"], validationType, message, done);
    });

});

describe("MinLength", function() {

    const constraint1 = 10;
    const validValues = ["helloworld", "hello how are you"];
    const invalidValues = [null, undefined, "hellowar", "howareyou"];

    class MyClass {
        @MinLength(constraint1)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "minLength";
        const message = "someProperty must be longer than or equal to " + constraint1 + " characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("MaxLength", function() {

    const constraint1 = 10;
    const validValues = ["hellowar", "howareyou", "helloworld"];
    const invalidValues = [null, undefined, "helloworld!", "hello how are you"];

    class MyClass {
        @MaxLength(constraint1)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "maxLength";
        const message = "someProperty must be shorter than or equal to " + constraint1 + " characters";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("Matches", function() {

    const constraint = /abc/;
    const validValues = ["abc", "abcdef", "123abc"];
    const invalidValues = [null, undefined, "acb", "Abc"];

    class MyClass {
        @Matches(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "matches";
        const message = "someProperty must match " + constraint + " regular expression";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("IsMilitaryTime", function() {

    class MyClass {
        @IsMilitaryTime()
        someProperty: string;
    }

    it("should not fail for a valid time in the format HH:MM", function(done) {
        const validValues = ["10:22", "12:03", "16:32", "23:59", "00:00"];
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail for invalid time format", function(done) {
        const invalidValues = ["23:61", "25:00", "08:08 pm", "04:00am"];
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should fail for invalid values", function(done) {
        const invalidValues = [undefined, null, "23:00 and invalid counterpart"];
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

});

describe("isPhoneNumber", function() {
    describe("with region", function() {
        const validValues = [
            "0311111111", "031 633 60 01", "079 4 666 666", "075 416 20 30",
            "+41 311111111", "+41 31 633 60 01", "+41 79 4 666 666", "+41 75 416 20 30",
            "+41 (0)311111111", "+41 (0)31 633 60 01", "+41 (0)79 4 666 666", "+41 (0)75 416 20 30",
            "+49 9072 1111"
        ];
        const invalidValues = [undefined, null, "asdf", "1"];

        class MyClass {
            @IsPhoneNumber("CH")
            someProperty: string;
        }

        it("should not fail if validator.validate said that its valid", function(done) {
            checkValidValues(new MyClass(), validValues, done);
        });

        it("should fail if validator.validate said that its invalid", function(done) {
            checkInvalidValues(new MyClass(), invalidValues, done);
        });
    });

    describe("no region", function() {
        const validValues = [
            "+41 311111111", "+41 31 633 60 01", "+41 79 4 666 666", "+41 75 416 20 30",
            "+41 (0)311111111", "+41 (0)31 633 60 01", "+41 (0)79 4 666 666", "+41 (0)75 416 20 30",
            "+49 9072 1111"
        ];
        const invalidValues = [
            "0311111111", "031 633 60 01", "079 4 666 666", "075 416 20 30",
            undefined, null, "asdf", "1"
        ];

        class MyClass {
            @IsPhoneNumber(null)
            someProperty: string;
        }

        it("should not fail if validator.validate said that its valid", function(done) {
            checkValidValues(new MyClass(), validValues, done);
        });

        it("should fail if validator.validate said that its invalid", function(done) {
            checkInvalidValues(new MyClass(), invalidValues, done);
        });
    });
});

describe("IsISO31661Alpha2", function() {

    class MyClass {
        @IsISO31661Alpha2()
        someProperty: string;
    }

    it("should not fail for a valid ISO31661 Alpha2 code", function(done) {
        const validValues = ["AD", "AE", "AF", "AG"];
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail for invalid values", function(done) {
        const invalidValues = [undefined, null, "", "AFR"];
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

});

describe("IsISO31661Alpha3", function() {

    class MyClass {
        @IsISO31661Alpha3()
        someProperty: string;
    }

    it("should not fail for a valid ISO31661 Alpha3 code", function(done) {
        const validValues = ["ABW", "HND", "KHM", "RWA"];
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail for invalid values", function(done) {
        const invalidValues = [undefined, null, "", "FR", "fR", "GB", "PT", "CM", "JP", "PM", "ZW"];
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

});


// -------------------------------------------------------------------------
// Specifications: array check
// -------------------------------------------------------------------------

describe("ArrayContains", function() {

    const constraint = ["superman"];
    const validValues = [["world", "hello", "superman"], ["world", "superman", "hello"], ["superman", "world", "hello"]];
    const invalidValues = [null, undefined, ["world", "hello"]];

    class MyClass {
        @ArrayContains(constraint)
        someProperty: string[];
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.arrayContains(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.arrayContains(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "arrayContains";
        const message = "someProperty must contain " + constraint + " values";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("ArrayNotContains", function() {

    const constraint = ["superman"];
    const validValues = [["world", "hello"]];
    const invalidValues = [null, undefined, ["world", "hello", "superman"], ["world", "superman", "hello"], ["superman", "world", "hello"]];

    class MyClass {
        @ArrayNotContains(constraint)
        someProperty: string[];
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.arrayNotContains(value, constraint).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.arrayNotContains(value, constraint).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "arrayNotContains";
        const message = "someProperty should not contain " + constraint + " values";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("ArrayNotEmpty", function() {

    const validValues = [[0], [""], [null], [undefined], [false], ["world", "hello", "superman"], ["world", "superman", "hello"], ["superman", "world", "hello"]];
    const invalidValues: any[] = [null, undefined, []];

    class MyClass {
        @ArrayNotEmpty()
        someProperty: string[];
    }

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.arrayNotEmpty(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.arrayNotEmpty(value).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "arrayNotEmpty";
        const message = "someProperty should not be empty";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("ArrayMinSize", function() {

    const constraint = 2;
    const validValues = [["world", "hello"]];
    const invalidValues = [null, undefined, ["hi"]];

    class MyClass {
        @ArrayMinSize(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "arrayMinSize";
        const message = "someProperty must contain at least " + constraint + " elements";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("ArrayMaxSize", function() {

    const constraint = 2;
    const validValues = [["world", "hello"]];
    const invalidValues = [null, undefined, ["hi", "hello", "javascript"]];

    class MyClass {
        @ArrayMaxSize(constraint)
        someProperty: string;
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

    it("should return error object with proper data", function(done) {
        const validationType = "arrayMaxSize";
        const message = "someProperty must contain not more than " + constraint + " elements";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("ArrayUnique", function () {

    const validValues = [["world", "hello", "superman"], ["world", "superman", "hello"], ["superman", "world", "hello"]];
    const invalidValues: any[] = [null, undefined, ["world", "hello", "hello"], ["world", "hello", "world"], ["1", "1", "1"]];

    class MyClass {
        @ArrayUnique()
        someProperty: string[];
    }

    it("should not fail if validator.validate said that its valid", function (done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function (done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function () {
        validValues.forEach(value => validator.arrayUnique(value).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function () {
        invalidValues.forEach(value => validator.arrayUnique(value).should.be.false);
    });

    it("should return error object with proper data", function (done) {
        const validationType = "arrayUnique";
        const message = "All someProperty's elements must be unique";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});

describe("isInstance", function () {

    class MySubClass { }
    class WrongSubClass {}

    class MyClass {
        @IsInstance(MySubClass)
        someProperty: MySubClass;
    }

    const validValues = [new MySubClass()];
    const invalidValues = [null, undefined, 15, "something", new WrongSubClass(), () => <any>null];

    it("should not fail if validator.validate said that its valid", function(done) {
        checkValidValues(new MyClass(), validValues, done);
    });

    it("should fail if validator.validate said that its invalid", function(done) {
        checkInvalidValues(new MyClass(), invalidValues, done);
    });

    it("should not fail if method in validator said that its valid", function() {
        validValues.forEach(value => validator.isInstance(value, MySubClass).should.be.true);
    });

    it("should fail if method in validator said that its invalid", function() {
        invalidValues.forEach(value => validator.isInstance(value, MySubClass).should.be.false);
    });

    it("should return error object with proper data", function(done) {
        const validationType = "isInstance";
        const message = "someProperty must be an instance of MySubClass";
        checkReturnedError(new MyClass(), invalidValues, validationType, message, done);
    });

});
