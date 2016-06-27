# class-validator

Allows to use decorator and non-decorator based validation in your Typescript classes.
Internally uses [validator.js][1] to perform validation.

## Release Notes

**0.4.0** [BREAKING CHANGES]

* refactoring
* everything should be imported from "class-validator" main entry point now
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

## Installation

1. Install module:

    `npm install class-validator --save`

2. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    if you are building nodejs app, you may want to `require("es6-shim");` in your app.
    or if you are building web app, you man want to add `<script src="path-to-shim/es6-shim.js">` on your page.

## Usage

Create your class and put some validation decorators on its properties you want to validate:

```typescript
import {validate, Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "class-validator";

export class Post {

    @IsLength(10, 20)
    title: string;

    @Contains('hello')
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
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

let errors = validate(post); // returns you array of errors
```

There are some additional functions you may want to use:

```typescript
validateAsync(post); // returns Promise<Post> if validation success, throws error if validation fail
validateOrThrow(post); // performs validation and throws ValidationError if validation fail
isValid(post); // simply checks if given object is valid. Returns true if it is, false otherwise
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

## Validating arrays

If your field is an array and you want to perform validation of each item in the array you need to specify a
special decorator option:

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
        groups: ['registration']
    })
    age: number;

    @Length(2, 20, {
        groups: ['registration', 'admin']
    })
    name: string;
}

let user = new User();
user.age = 10;
user.name = 'Alex';

validate(user, {
    groups: ['registration']
}); // this will not pass validation

validate(user, {
    groups: ['admin']
}); // this will pass validation

validate(user, {
    groups: ['registration', 'admin']
}); // this will not pass validation

validate(user, {
    groups: []
}); // this will pass validation
```

## Custom validation classes

If you have custom validation logic you want to use as annotations you can do it this way:

1. First create a file, lets say `CustomTextLength.ts`, and create there a new class:

    ```typescript
    import {ValidatorConstraint, ValidatorInterface} from "class-validator";

    @ValidatorConstraint()
    export class CustomTextLength implements ValidatorInterface {

        validate(text: string): boolean {
            return text.length > 1 && text.length < 10;
        }

    }
    ```

    Your class should implement `ValidatorInterface` interface and its `validate` method, which defines logic for data if
    its valid or not.

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
import {Validator} from "class-validator";

// do this somewhere in the global application level:
let validator = Container.get(Validator);
validator.container = Container;

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraints
```

## Manual validation

There are several method exist in the Validator that allows to perform non-decorator based validation:

```typescript
import Validator from "class-validator";

// Validation methods

Validator.contains(str, seed);
Validator.equals(str, comparison);
Validator.isAfter(date, afterDate);
Validator.isAlpha(str);
Validator.isAlphanumeric(str);
Validator.isAscii(str);
Validator.isBase64(str);
Validator.isBefore(date, beforeDate);
Validator.isBoolean(str);
Validator.isBooleanString(str);
Validator.isByteLength(str, min, max);
Validator.isCreditCard(str);
Validator.isCurrency(str, options);
Validator.isDate(str);
Validator.isDecimal(str);
Validator.isDivisibleBy(str, num);
Validator.isEmail(str, options);
Validator.isFQDN(str, options);
Validator.isFloat(str, options);
Validator.isFullWidth(str);
Validator.isHalfWidth(str);
Validator.isVariableWidth(str);
Validator.isHexColor(str);
Validator.isHexadecimal(str);
Validator.isIP(str, version);
Validator.isISBN(str, version);
Validator.isISIN(str);
Validator.isISO8601(str);
Validator.isIn(str, values);
Validator.isInt(str, options);
Validator.isJSON(str);
Validator.isLength(str, min, max);
Validator.isLowercase(str);
Validator.isMobilePhone(str, locale);
Validator.isMongoId(str);
Validator.isMultibyte(str);
Validator.isNumericString(str);
Validator.isSurrogatePair(str);
Validator.isURL(str, options);
Validator.isUUID(str, version);
Validator.isUppercase(str);
Validator.matches(str, pattern, modifiers);

```

## Validation decorators

| Decorator                                       | Description                                                                                        |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `@Contains(seed: string)`                       | Checks if the string contains the seed.                                                            |
| `@Equals(comparison: any)`                      | Checks if value equals ("===") comparison.                                                       |
| `@IsAfter(date: Date)`                          | Checks if the date is a date that's after the specified date.                                    |
| `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z).                                               |
| `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers.                                            |
| `@IsAscii()`                                    | Checks if the string contains ASCII chars only.                                                    |
| `@IsBase64()`                                   | Checks if a string is base64 encoded.                                                              |
| `@IsBefore(date: Date)`                         | Checks if the date that's before the specified date.                                   |
| `@IsBoolean()`                                  | Checks if a value is a boolean.                                                                    |
| `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false").                                       |
| `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range.                                         |
| `@IsCreditCard()`                               | Checks if the string is a credit card.                                                             |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount.                                                   |
| `@IsDate()`                                     | Checks if the string is a date.                                                                    |
| `@IsDivisibleBy(number: number)`                | Checks if the string is a number that's divisible by another.                                      |
| `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.                                                                  |
| `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com).                           |
| `@IsFloat(options?: IsFloatOptions)`            | Checks if the string is a float.                                                                   |
| `@IsPositiveFloat(options?: IsFloatOptions)`    | Checks if the string is a positive float.                                                                   |
| `@IsNegativeFloat(options?: IsFloatOptions)`    | Checks if the string is a negative float.                                                                   |
| `@IsFullWidth()`                                | Checks if the string contains any full-width chars.                                                |
| `@IsHalfWidth()`                                | Checks if the string contains any half-width chars.                                                |
| `@IsHexColor()`                                 | Checks if the string is a hexadecimal color.                                                       |
| `@IsHexadecimal()`                              | Checks if the string is a hexadecimal number.                                                      |
| `@IsIP(version?: number)`                       | Checks if the string is an IP (version 4 or 6).                                                    |
| `@IsISBN(version?: number)`                     | Checks if the string is an ISBN (version 10 or 13).                                                |
| `@IsISIN()`                                     | Checks if the string is an ISIN (stock/security identifier).                                       |
| `@IsISO8601()`                                  | Checks if the string is a valid ISO 8601 date.                                                     |
| `@IsIn(values: any[])`                          | Checks if the string is in a array of allowed values.                                              |
| `@IsInt(options?: IsIntOptions)`                | Checks if the string is an integer.                                                                |
| `@IsPositiveInt(options?: IsIntOptions)`        | Checks if the string is a positive integer.                                                        |
| `@IsNegativeInt(options?: IsIntOptions)`        | Checks if the string is a negative integer.                                                        |
| `@IsJSON()`                                     | Checks if the string is valid JSON.                                                                |
| `@IsLength(min: number, max?: number)`          | Checks if the string's length falls in a range.                                                    |
| `@IsLowercase()`                                | Checks if the string is lowercase.                                                                 |
| `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number.                                                     |
| `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                  |
| `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars.                                         |
| `@IsNumericString()`                            | Checks if the string is numeric.                                                                   |
| `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars.                                           |
| `@IsUrl(options?: IsURLOptions)`                | Checks if the string is an url.                                                                    |
| `@IsUUID(version?: number)`                     | Checks if the string is a UUID (version 3, 4 or 5).                                                |
| `@IsUppercase()`                                | Checks if the string is uppercase.                                                                 |
| `@IsVariableWidth()`                            | Checks if the string contains a mixture of full and half-width chars.                              |
| `@Matches(pattern: RegExp, modifiers?: string)` | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i'). |
| `@MinLength(min: number)`                       | Checks if the string's length is not less then given number.                                       |
| `@MaxLength(max: number)`                       | Checks if the string's length is not more then given number.                                       |
| `@MinNumber(min: number)`                       | Checks if the given number is not less then given number.                                          |
| `@MaxNumber(max: number)`                       | Checks if the given number is not more then given number.                                          |
| `@NotEmpty()`                                   | Checks if given value is not empty.                                                                |
| `@NotEmptyArray()`                              | Checks if given array is not empty.                                                                |
| `@MinSize(min: number)`                         | Checks if array's length is as minimal this number.                                                |
| `@MaxSize(max: number)`                         | Checks if array's length is as maximal this number.                                                |

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/class-validator/tree/master/sample) for more examples of
usages.

## FAQ

* Which node version is supported?

    This module is tested on > node 4.0, so its highly recommended if you install the latest version of node.
    If you are using old versions of node, the major dependency (afaik) of this module is on ES6 Promises, which are
    supported by some of the old versions of node too. In the case if your node version does not support promises you
    can try to npm install `es6-shim` module and include it to make promises work in your version of node.

* Is this library production-ready?

    The library is under active development, and needs better testing and contributions from community. If you want
    to use it in production its highly recommended to fix library version that you use in your package.json file.
    Personally I use it in production.

## Todos

* cover with tests
* more validation options
* add support for json-schema based validation
* use something better then validator.js and solve string-only validation issues

[1]: https://github.com/chriso/validator.js
[2]: https://github.com/pleerock/typedi
[2]: https://github.com/pleerock/class-sanitizer