# Validator.ts

Wrapper over [validator.js][1] library that provides you easy way to use it with Typescript classes.

## Installation

1. Install module:

    `npm install --save validator.ts`

2. Install required [tsd](http://definitelytyped.org/tsd/) dependencies:

    `tsd install --save es6-promise`

## Usage

Create your class and put some validation annotations on its properties you want to validate:

```typescript
import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "validator.ts/ValidationAnnotations";

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

## Sanity decorators

*TBD*

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