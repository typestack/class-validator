# Validator.ts

Wrapper over [validator.js][1] library that provides you easy way to use it with Typescript classes.

## Installation

1. Install module:

    `npm install --save validator.ts`

2. Install required [tsd](http://definitelytyped.org/tsd/) dependencies
(only in the case if you are targetting ES3/ES5 in tsconfig of your project. If you are using ES6 this step is not required):

    `tsd install --save es6-promise`

3. Link you tsd modules:

    `tsd link`

## Usage

Create your class and put some validation annotations on its properties you want to validate:

```typescript
import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "validator.ts/decorator/ValidationDecorators";

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

console.log(validator.validate(Post, post)); // returns you array of errors for fields that didn't pass validation
```

Validator also supports validation groups.
Take a look on samples in `./sample` for more examples of usages.

## Validation decorators

| Decorator                                       | Description                                                                                       |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `@Contains(seed: string)`                       | Check if the string contains the seed.                                                            |
| `@Equals(comparison: string)`                   | Check if the string matches the comparison.                                                       |
| `@IsAfter(date: Date)`                          | Check if the string is a date that's after the specified date.                                    |
| `@IsAlpha()`                                    | Check if the string contains only letters (a-zA-Z).                                               |
| `@IsAlphanumeric()`                             | Check if the string contains only letters and numbers.                                            |
| `@IsAscii()`                                    | Check if the string contains ASCII chars only.                                                    |
| `@IsBase64()`                                   | Check if a string is base64 encoded.                                                              |
| `@IsBefore(date: Date)`                         | Check if the string is a date that's before the specified date.                                   |
| `@IsBoolean()`                                  | Check if a string is a boolean.                                                                   |
| `@IsByteLength(min: number, max?: number)`      | Check if the string's length (in bytes) falls in a range.                                         |
| `@IsCreditCard()`                               | Check if the string is a credit card.                                                             |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Check if the string is a valid currency amount.                                                   |
| `@IsDate()`                                     | Check if the string is a date.                                                                    |
| `@IsDecimal()`                                  | Check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.         |
| `@IsDivisibleBy(number: number)`                | Check if the string is a number that's divisible by another.                                      |
| `@IsEmail(options?: IsEmailOptions)`            | Check if the string is an email.                                                                  |
| `@IsFQDN(options?: IsFQDNOptions)`              | Check if the string is a fully qualified domain name (e.g. domain.com).                           |
| `@IsFloat(options?: IsFloatOptions)`            | Check if the string is a float.                                                                   |
| `@IsFullWidth()`                                | Check if the string contains any full-width chars.                                                |
| `@IsHalfWidth()`                                | Check if the string contains any half-width chars.                                                |
| `@IsHexColor()`                                 | Check if the string is a hexadecimal color.                                                       |
| `@IsHexadecimal()`                              | Check if the string is a hexadecimal number.                                                      |
| `@IsIP(version?: number)`                       | Check if the string is an IP (version 4 or 6).                                                    |
| `@IsISBN(version?: number)`                     | Check if the string is an ISBN (version 10 or 13).                                                |
| `@IsISIN()`                                     | Check if the string is an ISIN (stock/security identifier).                                       |
| `@IsISO8601()`                                  | Check if the string is a valid ISO 8601 date.                                                     |
| `@IsIn(values: any[])`                          | Check if the string is in a array of allowed values.                                              |
| `@IsInt(options?: IsIntOptions)`                | Check if the string is an integer.                                                                |
| `@IsJSON()`                                     | Check if the string is valid JSON.                                                                |
| `@IsLength(min: number, max?: number)`          | Check if the string's length falls in a range.                                                    |
| `@IsLowercase()`                                | Check if the string is lowercase.                                                                 |
| `@IsMobilePhone(locale: string)`                | Check if the string is a mobile phone number.                                                     |
| `@IsMongoId()`                                  | Check if the string is a valid hex-encoded representation of a MongoDB ObjectId.                  |
| `@IsMultibyte()`                                | Check if the string contains one or more multibyte chars.                                         |
| `@IsNull()`                                     | Check if the string is null.                                                                      |
| `@IsNumeric()`                                  | Check if the string is numeric.                                                                   |
| `@IsSurrogatePair()`                            | Check if the string contains any surrogate pairs chars.                                           |
| `@IsUrl(options?: IsURLOptions)`                | Check if the string is a fully qualified domain name (e.g. domain.com).                           |
| `@IsUUID(version?: number)`                     | Check if the string is a UUID (version 3, 4 or 5).                                                |
| `@IsUppercase()`                                | Check if the string is uppercase.                                                                 |
| `@IsVariableWidth()`                            | Check if the string contains a mixture of full and half-width chars.                              |
| `@Matches(pattern: RegExp, modifiers?: string)` | Check if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i'). |
| `@MinLength(min: number)`                       | Check if the string's length is not less then given number.                                       |
| `@MaxLength(max: number)`                       | Check if the string's length is not more then given number.                                       |
| `@MinNumber(min: number)`                       | Check if the given number is not less then given number.                                          |
| `@MaxNumber(max: number)`                       | Check if the given number is not more then given number.                                          |
| `@NotEmpty()`                                   | Checks if given value is not empty.                                                               |
| `@NotEmptyArray()`                              | Checks if given array is not empty.                                                               |
| `@MinElements(min: number)`                     | Checks if array's length is as minimal this number.                                               |
| `@MaxElements(max: number)`                     | Checks if array's length is as maximal this number.                                               |


## Sanity decorators

| Decorator                        | Description                                                                                                                                                             |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@Blacklist(chars: RegExp)`      | Remove characters that appear in the blacklist.                                                                                                                         |
| `@Escape()`                      | Replace <, >, &, ', " and / with HTML entities.                                                                                                                         |
| `@Ltrim()`                       | Trim characters from the left-side of the input.                                                                                                                        |
| `@NormalizeEmail()`              | Canonicalize an email address.                                                                                                                                          |
| `@Rtrim()`                       | Trim characters from the left-side of the input.                                                                                                                        |
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