# Validator.ts

Allows to use decorator and non-decorator based validation in your Typescript classes.
Internally uses [validator.js][1] to make validation and sanitization.

## Installation

1. Install module:

    `npm install validator.ts --save`

2. Use [typings](https://github.com/typings/typings) to install all required definition dependencies.

    `typings install`

3. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    if you are building nodejs app, you may want to `require("es6-shim");` in your app.
    or if you are building web app, you man want to add `<script src="path-to-shim/es6-shim.js">` on your page.

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

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

let validator = new Validator();
let errors = validator.validate(post); // returns you array of errors
```

If you want to do sanitization you should use `sanitize` method:

```typescript
validator.sanitize(post);
```

There are some additional methods you may want to use:

```typescript
validator.validateAsync<Post>(post); // returns Promise<Post> if validation success, throws error if validation fail
validator.validateOrThrow(post); // performs validation and throws ValidationError if validation fail
validator.sanitizeAsync<Post>(post);// returns Promise<Post> after sanitization
validator.sanitizeAndValidate(post); // performs both sanitization and validation of the given object
validator.sanitizeAndValidateAsync<Post>(post); // performs both sanitization and validation and returns Promise<Post>
validator.isValid(post); // simply checks if given object is valid. Returns true if it is, false otherwise
```

## Validation messages

You can specify validation message to decorator options and this message will be returned in `ValidationError`
object returned by `validate` method in the case if validation for this field fail.

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

If your field is an array and you want to perform validation of each item in the array you need to specify a
special decorator option:

```typescript
import {MinLength, MaxLength} from "validator.ts/decorator/Validation";

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
import {ValidateNested} from "validator.ts/decorator/Validation";

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
import {Validator} from "validator.ts/Validator";
// ...
let validator = new Validator();
validator.validate(post, { skipMissingProperties: true });
```

## Validation groups

In different situations you may want to use different validation schemas of the same object.
 In such cases you can use validation groups.

```typescript
import {Validator} from "validator.ts/Validator";
import {MinNumber, Length} from "validator.ts/decorator/Validation";

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

let validator = new Validator();

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

## Custom validation classes

If you have custom validation logic you want to use as annotations you can do it this way:

1. First create a file, lets say `CustomTextLength.ts`, and create there a new class:

    ```typescript
    import {ValidatorInterface} from "validator.ts/ValidatorInterface";
    import {ValidatorConstraint} from "validator.ts/decorator/Validation";

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
    import {Validate} from "validator.ts/decorator/Validation";
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
    import {Validator} from "validator.ts/Validator";

    let validator = new Validator();
    validator.validate(post);
    ```

## Using service container

Validator supports service container in the case if want to inject dependencies into your custom validator constraint
classes. Here is example how to integrate it with [typedi][2]:

```typescript
import {Container} from "typedi/Container";
import {Validator} from "validator.ts/Validator";

// do this somewhere in the global application level:
let validator = Container.get<Validator>(Validator);
validator.container = Container;

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraints
```

## Manual validation

There are several method exist in the Validator that allows to perform non-decorator based validation:

```typescript
import {Validator} from "validator.ts/Validator";

// Validation methods

validator.contains(str, seed);
validator.equals(str, comparison);
validator.isAfter(date, afterDate);
validator.isAlpha(str);
validator.isAlphanumeric(str);
validator.isAscii(str);
validator.isBase64(str);
validator.isBefore(date, beforeDate);
validator.isBoolean(str);
validator.isBooleanString(str);
validator.isByteLength(str, min, max);
validator.isCreditCard(str);
validator.isCurrency(str, options);
validator.isDate(str);
validator.isDecimal(str);
validator.isDivisibleBy(str, num);
validator.isEmail(str, options);
validator.isFQDN(str, options);
validator.isFloat(str, options);
validator.isFullWidth(str);
validator.isHalfWidth(str);
validator.isVariableWidth(str);
validator.isHexColor(str);
validator.isHexadecimal(str);
validator.isIP(str, version);
validator.isISBN(str, version);
validator.isISIN(str);
validator.isISO8601(str);
validator.isIn(str, values);
validator.isInt(str, options);
validator.isJSON(str);
validator.isLength(str, min, max);
validator.isLowercase(str);
validator.isMobilePhone(str, locale);
validator.isMongoId(str);
validator.isMultibyte(str);
validator.isNull(str);
validator.isNumeric(str);
validator.isSurrogatePair(str);
validator.isURL(str, options);
validator.isUUID(str, version);
validator.isUppercase(str);
validator.matches(str, pattern, modifiers);

// Sanitization methods

validator.blacklist(str, chars);
validator.escape(str);
validator.ltrim(str, chars);
validator.normalizeEmail(str, isLowercase);
validator.rtrim(str, chars);
validator.stripLow(str, keepNewLines);
validator.toBoolean(input, isStrict);
validator.toDate(input);
validator.toFloat(input);
validator.toInt(input, radix);
validator.toString(input);
validator.trim(str, chars);
validator.whitelist(str, chars);

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
| `@IsBoolean()`                                  | Checks if a value is a boolean.                                                                    |
| `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false").                                       |
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

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/validator.ts/tree/master/sample) for more examples of
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

[1]: https://github.com/chriso/validator.js
[2]: https://github.com/pleerock/typedi