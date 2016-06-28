# class-validator

Allows to use decorator and non-decorator based validation in your Typescript classes.
Internally uses [validator.js][1] to perform validation.

## Installation

1. Install module:

    `npm install class-validator --save`

2. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    and use it somewhere in the global place of your app:

    * for nodejs: `require("es6-shim")` in your app's entry point (for example in `app.ts`)
    * for browser: `<script src="path-to-shim/es6-shim.js">` in your `index.html`

    For node.js users this step is only required if you are using old versions of node.

## Usage

Create your class and put some validation decorators on its properties you want to validate:

```typescript
import {validate, Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "class-validator";

export class Post {

    @IsLength(10, 20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt({ min: 0, max: 10 })
    rating: number;

    @IsEmail()
    email: string;

    @IsFQDN()
    site: string;

    @IsDate()
    createDate: Date;

}

let post = new Post();
post.title = "Hello"; // should not pass
post.text = "this is a great post about hell world"; // should not pass
post.rating = 11; // should not pass
post.email = "google.com"; // should not pass
post.site = "googlecom"; // should not pass

validate(post).then(errors => {
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
    } else {
        console.log("validation succeed");
    }
}); // returns you array of errors
```

## Validation messages

You can specify validation message to decorator options and this message will be returned in `ValidationError`
object returned by `validate` method in the case if validation for this field fail.

```typescript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, {
        message: "Title is too short"
    })
    @MaxLength(50, {
        message: "Title is too long"
    })
    title: string;
}
```

You can also use special variables like `$constraint` and `$constraint2` and they will be replaced where they are available:

```typescript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, { // here, $constraint will be replaced with "10", and $value with actual supplied value
        message: "Title is too short. Minimal length is $constraint characters, but actual is $value"
    })
    @MaxLength(50, { // here, $constraint will be replaced with "50", and $value with actual supplied value
        message: "Title is too long. Maximal length is $constraint characters, but actual is $value"
    })
    title: string;
}
```

Also you can provide a function, that should return message. Values are being passed to this function, so you can
use that data to provide more granular messages:

```typescript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, {
        message: (value: any, constraint: any) => { // value is user's supplied value, constraint is 10 here, constraint2 is not available here, so its `undefined`. You can omit it.
            if (constraint === 1) {
                return "Too short, minimal length is 1 character";
            } else {
                return "Too short, minimal length is " + constraint + " characters";
            }
        }
    })
    title: string;
}
```

## Validating arrays

If your field is an array and you want to perform validation of each item in the array you must specify a
special decorator option `each: true`:

```typescript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MaxLength(20, {
        each: true
    })
    tags: string[];
}
```

This will validate each item in `post.tags` array.

## Validating nested objects

If your object contains nested objects and you want validator to perform validation of them too, then you need to
use special decorator:

```typescript
import {ValidateNested} from "class-validator";

export class Post {

    @ValidateNested()
    user: User;

}
```

## Skipping missing properties

Sometimes you may want to skip validation of the properties that does not exist in the validating object. This is
usually desirable when you want to update some parts of the document, and want to validate only updated parts,
but skip everything else, e.g. skip missing properties.
In such situations you need to pass a special flag to `validate` method:

```typescript
import {validate} from "class-validator";
// ...
validate(post, { skipMissingProperties: true });
```

## Validation groups

In different situations you may want to use different validation schemas of the same object.
 In such cases you can use validation groups.

```typescript
import {validate, MinNumber, Length} from "class-validator";

export class User {

    @MinNumber(12, {
        groups: ["registration"]
    })
    age: number;

    @Length(2, 20, {
        groups: ["registration", "admin"]
    })
    name: string;
}

let user = new User();
user.age = 10;
user.name = "Alex";

validate(user, {
    groups: ["registration"]
}); // this will not pass validation

validate(user, {
    groups: ["admin"]
}); // this will pass validation

validate(user, {
    groups: ["registration", "admin"]
}); // this will not pass validation

validate(user, {
    groups: []
}); // this will pass validation
```

## Custom validation classes

If you have custom validation logic you want to use as annotations you can do it this way:

1. First create a file, lets say `CustomTextLength.ts`, and create there a new class:

    ```typescript
    import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

    @ValidatorConstraint("custom_text")
    export class CustomTextLength implements ValidatorConstraintInterface {

        validate(text: string) {
            return text.length > 1 && text.length < 10;
        }

    }
    ```

    Your class should implement `ValidatorConstraintInterface` interface and its `validate` method, which defines logic for data if
    its valid or not. Custom validator can be asynchronous, if you want to perform validation after some asynchronous
    operations, simply return a promise in `validate` method.

    You can also supply a validation constraint name - this name will be used as "error type" in ValidationErrors.

2. Then you can use your new validation constraint in your class:

    ```typescript
    import {Validate} from "class-validator";
    import {CustomTextLength} from "./CustomTextLength";

    export class Post {

        @Validate(CustomTextLength, {
            message: "Wrong post title"
        })
        title: string;

    }
    ```

    Here we set our newly created `CustomTextLength` validation constraint for `Post.title`.

3. Now you can use validator as usual:

    ```typescript
    import {validate} from "class-validator";

    validate(post);
    ```

## Using service container

Validator supports service container in the case if want to inject dependencies into your custom validator constraint
classes. Here is example how to integrate it with [typedi][2]:

```typescript
import {Container} from "typedi";
import {useContainer} from "class-validator";

// do this somewhere in the global application level:
useContainer(Container);
let validator = Container.get(Validator);

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraints
```

## Manual validation

There are several method exist in the Validator that allows to perform non-decorator based validation:

```typescript
import {Validator} from "class-validator";

// Validation methods
const validator = new Validator();

// common validation methods
validator.equals(value, comparison); // Checks if value matches ("===") the comparison.
validator.notEquals(value, comparison); // Checks if value does not match ("!==") the comparison.
validator.empty(value); // Checks if given value is empty (=== '', === null, === undefined).
validator.notEmpty(value); // Checks if given value is not empty (!== '', !== null, !== undefined).
validator.isIn(value, possibleValues); // Checks if given value is in a array of allowed values.
validator.isNotIn(value, possibleValues); // Checks if given value not in a array of allowed values.

// type validation methods
validator.isBoolean(value); // Checks if a given value is a real boolean.
validator.isDate(value); // Checks if a given value is a real date.
validator.isString(value); // Checks if a given value is a real string.
validator.isNumber(value); // Checks if a given value is a real number.
validator.isInt(value); // Checks if value is an integer.
validator.isDecimal(value); // Checks if value represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.

// number validation methods
validator.divisibleBy(value, num); // Checks if value is a number that's divisible by another.
validator.isPositive(value); // Checks if the value is a positive number.
validator.isNegative(value); // Checks if the value is a negative number.
validator.greaterThen(firstNumber, secondNumber); // Checks if the first number is greater then second.
validator.lessThen(firstNumber, secondNumber); // Checks if the first number is less then second.

// date validation methods
validator.minDate(date, minDate); // Checks if the value is a date that's after the specified date.
validator.maxDate(date, minDate); // Checks if the value is a date that's before the specified date.

// string-type validation methods
validator.isBooleanString(str); // Checks if a string is a boolean.
validator.isDateString(str); // Checks if the string is a date.
validator.isNumberString(str); // Checks if the string is numeric.

// string validation methods
validator.contains(str, seed); // Checks if the string contains the seed.
validator.notContains(str, seed); // Checks if the string does not contain the seed.
validator.isAlpha(str); // Checks if the string contains only letters (a-zA-Z).
validator.isAlphanumeric(str); // Checks if the string contains only letters and numbers.
validator.isAscii(str); // Checks if the string contains ASCII chars only.
validator.isBase64(str); // Checks if a string is base64 encoded.
validator.isByteLength(str, min, max); // Checks if the string's length (in bytes) falls in a range.
validator.isCreditCard(str); // Checks if the string is a credit card.
validator.isCurrency(str, options); // Checks if the string is a valid currency amount.
validator.isEmail(str, options); // Checks if the string is an email.
validator.isFQDN(str, options); // Checks if the string is a fully qualified domain name (e.g. domain.com).
validator.isFullWidth(str); // Checks if the string contains any full-width chars.
validator.isHalfWidth(str); // Checks if the string contains any half-width chars.
validator.isVariableWidth(str); // Checks if the string contains variable-width chars.
validator.isHexColor(str); // Checks if the string is a hexadecimal color.
validator.isHexadecimal(str); // Checks if the string is a hexadecimal number.
validator.isIP(str, version); // Checks if the string is an IP (version 4 or 6).
validator.isISBN(str, version); // Checks if the string is an ISBN (version 10 or 13).
validator.isISIN(str); // Checks if the string is an ISIN (stock/security identifier).
validator.isISO8601(str); // Checks if the string is a valid ISO 8601 date.
validator.isJSON(str); // Checks if the string is valid JSON (note: uses JSON.parse).
validator.isLowercase(str); // Checks if the string is lowercase.
validator.isMobilePhone(str, locale); // Checks if the string is a mobile phone number.
validator.isMongoId(str); // Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
validator.isMultibyte(str); // Checks if the string contains one or more multibyte chars.
validator.isSurrogatePair(str); // Checks if the string contains any surrogate pairs chars.
validator.isURL(str, options); // Checks if the string is an url.
validator.isUUID(str, version); // Checks if the string is a UUID (version 3, 4 or 5).
validator.isUppercase(str); // Checks if the string is uppercase.
validator.length(str, min, max); // Checks if the string's length falls in a range.
validator.minLength(str, min); // Checks if the string's length is not less then given number.
validator.maxLength(str, max); // Checks if the string's length is not more then given number.
validator.matches(str, pattern, modifiers); // Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').

// array validation methods
validator.arrayContains(array, values); // Checks if array contains all values from the given array of values.
validator.arrayNotContains(array, values); // Checks if array does not contain any of the given values.
validator.arrayNotEmpty(array); // Checks if given array is not empty.
validator.arrayMinSize(array, min); // Checks if array's length is as minimal this number.
validator.arrayMaxSize(array, max); // Checks if array's length is as maximal this number.
validator.arrayUnique(array); // Checks if all array's values are unique. Comparison for objects is reference-based.
```

## Validation decorators

| Decorator                                       | Description                                                                                        |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Common validation decorators**                                                                                                                     |
| `@Equals(comparison: any)`                      | Checks if value equals ("===") comparison.                                                         |
| `@NotEquals(comparison: any)`                   | Checks if value not equal ("!==") comparison.                                                      |
| `@Empty()`                                      | Checks if given value is empty (=== '', === null, === undefined).                                  |
| `@NotEmpty()`                                   | Checks if given value is not empty (!== '', !== null, !== undefined).                              |
| `@In(values: any[])`                            | Checks if value is in a array of allowed values.                                                   |
| `@NotIn(values: any[])`                         | Checks if value is not in a array of disallowed values.                                            |
| **Type validation decorators**                                                                                                                       |
| `@IsBoolean()`                                  | Checks if a value is a boolean.                                                                    |
| `@IsDate()`                                     | Checks if the string is a date.                                                                    |
| `@IsString()`                                   | Checks if the string is a string.                                                                  |
| `@IsNumber()`                                   | Checks if the string is a number.                                                                  |
| `@IsInt()`                                      | Checks if the value is an integer number.                                                          |
| `@IsDecimal()`                                  | Checks if the value represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.          |
| **Number validation decorators**                                                                                                                     |
| `@DivisibleBy(num: number)`                     | Checks if the value is a number that's divisible by another.                                       |
| `@IsPositive()`                                 | Checks if the value is a positive number.                                                          |
| `@IsNegative()`                                 | Checks if the value is a negative number.                                                          |
| `@GreaterThen(num: number)`                     | Checks if the given number is greater then given number.                                           |
| `@LessThen(num: number)`                        | Checks if the given number is less then given number.                                              |
| **Date validation decorators**                                                                                                                       |
| `@MinDate(date: Date)`                          | Checks if the value is a date that's after the specified date.                                     |
| `@MaxDate(date: Date)`                          | Checks if the value is a date that's before the specified date.                                    |                                                                                                                                                  |
| **String-type validation decorators**                                                                                                                |
| `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false").                                       |
| `@IsDateString()`                               | Checks if a string is a date.                                                                      |
| `@IsNumberString()`                             | Checks if a string is a number.                                                                    |
| **String validation decorators**                                                                                                                     |
| `@Contains(seed: string)`                       | Checks if the string contains the seed.                                                            |
| `@NotContains(seed: string)`                    | Checks if the string not contains the seed.                                                        |
| `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z).                                               |
| `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers.                                            |
| `@IsAscii()`                                    | Checks if the string contains ASCII chars only.                                                    |
| `@IsBase64()`                                   | Checks if a string is base64 encoded.                                                              |
| `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range.                                         |
| `@IsCreditCard()`                               | Checks if the string is a credit card.                                                             |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount.                                                   |
| `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.                                                                  |
| `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com).                           |
| `@IsFullWidth()`                                | Checks if the string contains any full-width chars.                                                |
| `@IsHalfWidth()`                                | Checks if the string contains any half-width chars.                                                |
| `@IsVariableWidth()`                            | Checks if the string contains a mixture of full and half-width chars.                              |
| `@IsHexColor()`                                 | Checks if the string is a hexadecimal color.                                                       |
| `@IsHexadecimal()`                              | Checks if the string is a hexadecimal number.                                                      |
| `@IsIP(version?: "4"|"6")`                      | Checks if the string is an IP (version 4 or 6).                                                    |
| `@IsISBN(version?: "10"|"13")`                  | Checks if the string is an ISBN (version 10 or 13).                                                |
| `@IsISIN()`                                     | Checks if the string is an ISIN (stock/security identifier).                                       |
| `@IsISO8601()`                                  | Checks if the string is a valid ISO 8601 date.                                                     |
| `@IsJSON()`                                     | Checks if the string is valid JSON.                                                                |
| `@IsLowercase()`                                | Checks if the string is lowercase.                                                                 |
| `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number.                                                     |
| `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                  |
| `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars.                                         |
| `@IsNumericString()`                            | Checks if the string is numeric.                                                                   |
| `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars.                                           |
| `@IsUrl(options?: IsURLOptions)`                | Checks if the string is an url.                                                                    |
| `@IsUUID(version?: "3"|"4"|"5")`                | Checks if the string is a UUID (version 3, 4 or 5).                                                |
| `@IsUppercase()`                                | Checks if the string is uppercase.                                                                 |
| `@Length(min: number, max?: number)`            | Checks if the string's length falls in a range.                                                    |
| `@MinLength(min: number)`                       | Checks if the string's length is not less then given number.                                       |
| `@MaxLength(max: number)`                       | Checks if the string's length is not more then given number.                                       |
| `@Matches(pattern: RegExp, modifiers?: string)` | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i'). |
| **Array validation decorators**                                                                                                                      |
| `@ArrayContains(values: any[])`                 | Checks if array contains all values from the given array of values.                                |
| `@ArrayNotContains(values: any[])`              | Checks if array does not contain any of the given values.                                          |
| `@ArrayNotEmpty()`                              | Checks if given array is not empty.                                                                |
| `@ArrayMinSize(min: number)`                    | Checks if array's length is as minimal this number.                                                |
| `@ArrayMaxSize(max: number)`                    | Checks if array's length is as maximal this number.                                                |
| `@ArrayUnique()`                                | Checks if all array's values are unique. Comparison for objects is reference-based.                |

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/class-validator/tree/master/sample) for more examples of
usages.

## Release Notes

**0.4.0** *[BREAKING CHANGES]*

* refactoring
* everything should be imported from "class-validator" main entry point now
* `ValidatorInterface` has been renamed to `ValidatorConstraintInterface`
* contain can be set in the main entry point now
* some decorator's names changed. Be aware of this
* fixed all decorators that should not work only with strings
* added few more non-string decorators
* validator now returns array of ValidationError instead of ValidationErrorInterface. Removed old ValidationError
* removed all other validation methods except `validator.validate`
* finally validate method is async now, so custom async validations are supported now
* added ability to validate inherited properties

**0.3.0**

* package has changed its name from `validator.ts` to `class-validator`.
* sanitation functionality has been removed from this library. Use [class-sanitizer][3] instead.

## Todos

* cover with tests
* add support for json-schema based validation

[1]: https://github.com/chriso/validator.js
[2]: https://github.com/pleerock/typedi
[3]: https://github.com/pleerock/class-sanitizer