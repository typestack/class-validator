# Validator.ts

Wrapper over [validator.js][1] library that provides you easy way to use it with Typescript classes.

## Installation

1. Install module:

    `npm install --save validator.ts`

2. Install required [tsd](http://definitelytyped.org/tsd/) dependencies
(only in the case if you are targetting ES3/ES5 in tsconfig of your project. If you are using ES6 this step is not required):

    `tsd install --save es6-shim`

3. Link you tsd modules:

    `tsd link`

## Usage

Create your class and put some validation decorators on its properties you want to validate:

```typescript
import {Validator} from "validator.ts/Validator";
import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "validator.ts/decorator/Validation";

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

let validator = new Validator();

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

console.log(validator.validate(post)); // returns you array of errors
```

Validator also supports validation groups.
Take a look on samples in `./sample` for more examples of usages.

## Validation message

You can specify validation message decorator options to specify message that will be returned in ValidationError
object returned by `validate` method.

```typescript
import {MinLength, MaxLength} from "validator.ts/decorator/Validation";

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

If your value is an array and you want to perform validation against each item of the array you need to specify a
special option to decorator:

```typescript
import {MinLength, MaxLength} from "validator.ts/decorator/Validation";

export class Post {

    @MaxLength(20, {
        each: true
    })
    tags: string[];
}
```

## Validating nested objects

If your object contains nested objects and you want validator to perform validation of them too, then you need to
use special decorator:

```typescript
import {ValidateNested} from "validator.ts/decorator/Validation";

export class Post {

    @ValidateNested()
    user: User;

}
```

## Skipping missing properties

Sometimes you may want to skip validation of the properties that does not exist. This is usually desirable when you
want to update some parts of the document, and want to validate only updated parts, but skip everything else, e.g.
skip missing properties. In such situations you need to pass a special flag to `validate` method:

```typescript
import {Validator} from "validator.ts/Validator";
// ...
let validator = new Validator();
validator.validate(post, { skipMissingProperties: true });
```

## Validation groups

In different situations you may want to use different validations for the same object.
 In such cases you can use validation groups.

```typescript
import {Validator} from "validator.ts/Validator";
import {MinNumber} from "validator.ts/decorator/Validation";

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

let validator = new Validator();

let user = new User();
user.age = 10;
user.name = 'Alex';

validator.validate(user, {
    groups: ['registration']
}); // this will not pass validation

validator.validate(user, {
    groups: ['admin']
}); // this will pass validation

validator.validate(user, {
    groups: ['registration', 'admin']
}); // this will not pass validation

validator.validate(user, {
    groups: []
}); // this will pass validation
```

## Validation decorators

| Decorator                                       | Description                                                                                        |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `@Contains(seed: string)`                       | Checks if the string contains the seed.                                                            |
| `@Equals(comparison: string)`                   | Checks if the string matches the comparison.                                                       |
| `@IsAfter(date: Date)`                          | Checks if the string is a date that's after the specified date.                                    |
| `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z).                                               |
| `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers.                                            |
| `@IsAscii()`                                    | Checks if the string contains ASCII chars only.                                                    |
| `@IsBase64()`                                   | Checks if a string is base64 encoded.                                                              |
| `@IsBefore(date: Date)`                         | Checks if the string is a date that's before the specified date.                                   |
| `@IsBoolean()`                                  | Checks if a string is a boolean.                                                                   |
| `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range.                                         |
| `@IsCreditCard()`                               | Checks if the string is a credit card.                                                             |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount.                                                   |
| `@IsDate()`                                     | Checks if the string is a date.                                                                    |
| `@IsDecimal()`                                  | Checks if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.         |
| `@IsDivisibleBy(number: number)`                | Checks if the string is a number that's divisible by another.                                      |
| `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.                                                                  |
| `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com).                           |
| `@IsFloat(options?: IsFloatOptions)`            | Checks if the string is a float.                                                                   |
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
| `@IsJSON()`                                     | Checks if the string is valid JSON.                                                                |
| `@IsLength(min: number, max?: number)`          | Checks if the string's length falls in a range.                                                    |
| `@IsLowercase()`                                | Checks if the string is lowercase.                                                                 |
| `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number.                                                     |
| `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                  |
| `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars.                                         |
| `@IsNull()`                                     | Checks if the string is null.                                                                      |
| `@IsNumeric()`                                  | Checks if the string is numeric.                                                                   |
| `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars.                                           |
| `@IsUrl(options?: IsURLOptions)`                | Checks if the string is a fully qualified domain name (e.g. domain.com).                           |
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


## Sanity decorators

| Decorator                        | Description                                                                                                                                                             |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@Blacklist(chars: RegExp)`      | Remove characters that appear in the blacklist.                                                                                                                         |
| `@Escape()`                      | Replace <, >, &, ', " and / with HTML entities.                                                                                                                         |
| `@Ltrim()`                       | Trim characters from the left-side of the input.                                                                                                                        |
| `@NormalizeEmail()`              | Canonicalize an email address.                                                                                                                                          |
| `@Rtrim()`                       | Trim characters from the right-side of the input.                                                                                                                        |
| `@StripLow()`                    | Remove characters with a numerical value < 32 and 127, mostly control characters.                                                                                       |
| `@ToBoolean(isStrict?: boolean)` | Convert the input to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.                                 |
| `@ToDate()`                      | Convert the input to a date, or null if the input is not a date.                                                                                                        |
| `@ToFloat()`                     | Convert the input to a float.                                                                                                                                           |
| `@ToInt()`                       | Convert the input to an integer, or NaN if the input is not an integer.                                                                                                 |
| `@ToString()`                    | Convert the input to a string.                                                                                                                                          |
| `@Trim(chars?: string[])`        | Trim characters (whitespace by default) from both sides of the input. You can specify chars that should be trimmed.                                                     |
| `@Whitelist(chars: RegExp)`      | Remove characters that do not appear in the whitelist.* The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\\[\\]'). |

## FAQ

* Which node version is supported?

    This module is tested on > node 4.0, so its highly recommended if you install the latest version of node.
    If you are using old versions of node, the major dependency (afaik) of this module is on ES6 Promises, which are
    supported by some of the old versions of node too. In the case if your node version does not support promises you
    can try to npm install `es6-promise` module and include it to make promises work in your version of node.

* Is this library production-ready?

    The library is under active development, and needs better testing and contributions from community. If you want
    to use it in production its highly recommended to fix library version that you use in your package.json file.
    Personally I use it in production.

## Todos

* cover with tests
* more documentation and samples
* add support to load validation configuration from json and plain javascript objects 
* add support to work with vanila js
* add support for custom validation classes

[1]: https://github.com/chriso/validator.js