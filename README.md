# class-validator-custom-errors

![Build Status](https://github.com/arizworld/class-validator-custom-errors/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/class-validator-custom-errors.svg)](https://badge.fury.io/js/class-validator-custom-errors)
[![install size](https://packagephobia.now.sh/badge?p=class-validator-custom-errors)](https://packagephobia.com/result?p=class-validator-custom-errors)

This package is a fork of [class-validator](https://github.com/typestack/class-validator) with the ability of customization of the error messages globally. Useful for implementing internationalization or multilingualism of the error messages or modifying the error messages in general for each validation.

## Table of Contents

- [class-validator-custom-errors](#class-validator-custom-errors)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Validation decorators](#validation-decorators)

## Installation

```sh
npm install class-validator-custom-errors --save
```

> Note: Please use at least npm@6 when using class-validator-custom-errors. From npm@6 the dependency tree is flattened, which is required by `class-validator-custom-errors` to function properly.

## Usage

Create your class and put some validation decorators on the properties you want to validate
and add custom `transformFunction` to provide implementation for the errorMessage and
add some custom `transformKey` to be passed to the `transformFunction` for handling the specific ones:

[stackblitz playground](https://stackblitz.com/edit/class-validator-custom-errors-basic-usage?file=index.ts)

```typescript
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator-custom-errors';

export class Post {
  @Length(10, 20)
  title!: string;

  @Contains('hello', {
    transformKey: 'customContainsKey', //transformKey to be passed to handle special cases
  })
  text!: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating!: number;

  @IsEmail()
  email!: string;

  @IsFQDN()
  site!: string;

  @IsDate()
  createDate!: Date;
}

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

validate(post, {
  validationError: {
    //pass a transform function to overwrite the default implementation for this validation only
    transformFunction: (key: string) => `I was called with ${key}`,
  },
}).then((errors) => {
  // errors is an array of validation errors
  if (errors.length > 0) {
    console.log('validation failed. errors: ', errors);
  } else {
    console.log('validation succeed');
  }
});

validateOrReject(post, {
  validationError: {
    //pass a transform function to overwrite the default implementation for this validation only
    transformFunction: (key: string) => `I was called with ${key}`,
  },
}).catch((errors) => {
  console.log('Promise rejected (validation failed). Errors: ', errors);
});
// or
async function validateOrRejectExample(input: any) {
  try {
    await validateOrReject(input,{
      validationError: {
        //pass a transform function to overwrite the default implementation for this validation only
        transformFunction: (key: string) => `I was called with ${key}`,
      },
    });
  } catch (errors) {
    console.log(
      'Caught promise rejection (validation failed). Errors: ',
      errors
    );
  }
}
```

Implementing internationalization with i18next:

Full code can be found in [stackblitz playground](https://stackblitz.com/~/github.com/arizworld/class-validator-custom-errors-i18next)

Or clone it from here [github class-validator-custom-errors-i18next](https://github.com/arizworld/class-validator-custom-errors-i18next)

```typescript
// locales/en/translation.json
{
  "success": "The request was successful!",
  "failure": "Something went wrong with the request!",
  "validation": {
    "isString": "$property must be a string.",
    "isEnum": "$property must be one of this $constraint2.",
    "isObject": "$property must be a object.",
    "uniqueString": "$property must be an unique string."
  }
}
// locales/fr/translation.json
{
  "success": "La demande a réussi!",
  "failure": "Quelque chose s'est mal passé avec la demande!",
  "validation": {
    "isString": "La $property doit être une chaîne de caractères.",
    "isEnum": "La $property doit être l'un de ceux-ci $constraint2.",
    "isObject": "La $property doit être un objet.",
    "isUnique": "La $property doit être une chaîne de caractères unique."
  }
}

// src/schemas/Url.ts
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from "class-validator-custom-errors";

export enum HttpProtocols {
  http = "http",
  https = "https",
  ws = "ws",
  wss = "wss",
  ftp = "ftp"
}

export class Query {
  @IsString()
  search!: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  select: string[] = []
}

export class Url {
  @IsString({
    transformKey: 'uniqueString'
  })
  host!: string

  @IsEnum(HttpProtocols)
  protocol!: string

  @IsString()
  tld!: string

  @IsObject()
  @ValidateNested()
  @Type(() => Query)
  query!: Query
}

// src/utils/i18nextSetup.js
import i18next from "i18next";
import I18NexFsBackend from "i18next-fs-backend";
import middleware from 'i18next-http-middleware'

i18next
  .use(I18NexFsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
  });

// src/main.ts
import express, { NextFunction, Request, Response } from 'express'
import i18next from 'i18next';
import middleware from 'i18next-http-middleware'
import './utils/i18nextSetup'
import 'reflect-metadata'
import { validateOrReject } from 'class-validator-custom-errors';
import { plainToClass } from 'class-transformer';
import { Url } from './schemas/Url';
const app = express()
app.use([
  middleware.handle(i18next),
  express.json(),
  express.urlencoded({ extended: true }),
]);
app.post('/urls/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await validateOrReject(plainToClass(Url, req.body), {
      whitelist: true,
      validationError: {
        target: false,
        transformFunction: (key: string) => req.t(`validation.${key}`)
      }
    })
    res.json({ success: true, message: req.t("success"), errors: null })
  } catch (error) {
    res.json({ success: false, message: req.t("failure"), errors: error })
  }
})
export default app

// src/main.ts

import inject from 'light-my-request'
import app from './server'
(async function () {
  const responseEnglish = await inject(app, {
    method: 'POST',
    url: '/urls/create',
    headers: {
      "content-type": "application/json"
    },
    payload: JSON.stringify({ query: {} })
  })
  console.log('responseEnglish: ', JSON.stringify(responseEnglish.json(), null, 2))
  const responseFrench = await inject(app, {
    method: 'POST',
    url: '/urls/create',
    headers: {
      "content-type": "application/json",
      "accept-language": "fr"
    },
    payload: JSON.stringify({ query: {} })
  })
  console.log('responseFrench: ', JSON.stringify(responseFrench.json(), null, 2))
})()
```
See this for more of the basic [class-validator documentation](https://github.com/typestack/class-validator)

## Validation decorators

| Decorator                                              | Description                                                                                                                                                                                           |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Common validation decorators**                       |                                                                                                                                                                                                       |
| `@IsDefined(value: any)`                               | Checks if value is defined (!== undefined, !== null). This is the only decorator that ignores skipMissingProperties option.                                                                           |
| `@IsOptional()`                                        | Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property.                                                                                       |
| `@Equals(comparison: any)`                             | Checks if value equals ("===") comparison.                                                                                                                                                            |
| `@NotEquals(comparison: any)`                          | Checks if value not equal ("!==") comparison.                                                                                                                                                         |
| `@IsEmpty()`                                           | Checks if given value is empty (=== '', === null, === undefined).                                                                                                                                     |
| `@IsNotEmpty()`                                        | Checks if given value is not empty (!== '', !== null, !== undefined).                                                                                                                                 |
| `@IsIn(values: any[])`                                 | Checks if value is in an array of allowed values.                                                                                                                                                     |
| `@IsNotIn(values: any[])`                              | Checks if value is not in an array of disallowed values.                                                                                                                                              |
| **Type validation decorators**                         |                                                                                                                                                                                                       |
| `@IsBoolean()`                                         | Checks if a value is a boolean.                                                                                                                                                                       |
| `@IsDate()`                                            | Checks if the value is a date.                                                                                                                                                                        |
| `@IsString()`                                          | Checks if the value is a string.                                                                                                                                                                      |
| `@IsNumber(options: IsNumberOptions)`                  | Checks if the value is a number.                                                                                                                                                                      |
| `@IsInt()`                                             | Checks if the value is an integer number.                                                                                                                                                             |
| `@IsArray()`                                           | Checks if the value is an array                                                                                                                                                                       |
| `@IsEnum(entity: object)`                              | Checks if the value is a valid enum                                                                                                                                                                   |
| **Number validation decorators**                       |
| `@IsDivisibleBy(num: number)`                          | Checks if the value is a number that's divisible by another.                                                                                                                                          |
| `@IsPositive()`                                        | Checks if the value is a positive number greater than zero.                                                                                                                                           |
| `@IsNegative()`                                        | Checks if the value is a negative number smaller than zero.                                                                                                                                           |
| `@Min(min: number)`                                    | Checks if the given number is greater than or equal to given number.                                                                                                                                  |
| `@Max(max: number)`                                    | Checks if the given number is less than or equal to given number.                                                                                                                                     |
| **Date validation decorators**                         |
| `@MinDate(date: Date \| (() => Date))`                 | Checks if the value is a date that's after the specified date.                                                                                                                                        |
| `@MaxDate(date: Date \| (() => Date))`                 | Checks if the value is a date that's before the specified date.                                                                                                                                       |
| **String-type validation decorators**                  |                                                                                                                                                                                                       |
| `@IsBooleanString()`                                   | Checks if a string is a boolean (e.g. is "true" or "false" or "1", "0").                                                                                                                              |
| `@IsDateString()`                                      | Alias for `@IsISO8601()`.                                                                                                                                                                             |
| `@IsNumberString(options?: IsNumericOptions)`          | Checks if a string is a number.                                                                                                                                                                       |
| **String validation decorators**                       |                                                                                                                                                                                                       |
| `@Contains(seed: string)`                              | Checks if the string contains the seed.                                                                                                                                                               |
| `@NotContains(seed: string)`                           | Checks if the string not contains the seed.                                                                                                                                                           |
| `@IsAlpha()`                                           | Checks if the string contains only letters (a-zA-Z).                                                                                                                                                  |
| `@IsAlphanumeric()`                                    | Checks if the string contains only letters and numbers.                                                                                                                                               |
| `@IsDecimal(options?: IsDecimalOptions)`               | Checks if the string is a valid decimal value. Default IsDecimalOptions are `force_decimal=False`, `decimal_digits: '1,'`, `locale: 'en-US'`                                                          |
| `@IsAscii()`                                           | Checks if the string contains ASCII chars only.                                                                                                                                                       |
| `@IsBase32()`                                          | Checks if a string is base32 encoded.                                                                                                                                                                 |
| `@IsBase58()`                                          | Checks if a string is base58 encoded.                                                                                                                                                                 |
| `@IsBase64(options?: IsBase64Options)`                 | Checks if a string is base64 encoded.                                                                                                                                                                 |
| `@IsIBAN()`                                            | Checks if a string is a IBAN (International Bank Account Number).                                                                                                                                     |
| `@IsBIC()`                                             | Checks if a string is a BIC (Bank Identification Code) or SWIFT code.                                                                                                                                 |
| `@IsByteLength(min: number, max?: number)`             | Checks if the string's length (in bytes) falls in a range.                                                                                                                                            |
| `@IsCreditCard()`                                      | Checks if the string is a credit card.                                                                                                                                                                |
| `@IsCurrency(options?: IsCurrencyOptions)`             | Checks if the string is a valid currency amount.                                                                                                                                                      |
| `@IsISO4217CurrencyCode()`                             | Checks if the string is an ISO 4217 currency code.                                                                                                                                                    |
| `@IsEthereumAddress()`                                 | Checks if the string is an Ethereum address using basic regex. Does not validate address checksums.                                                                                                   |
| `@IsBtcAddress()`                                      | Checks if the string is a valid BTC address.                                                                                                                                                          |
| `@IsDataURI()`                                         | Checks if the string is a data uri format.                                                                                                                                                            |
| `@IsEmail(options?: IsEmailOptions)`                   | Checks if the string is an email.                                                                                                                                                                     |
| `@IsFQDN(options?: IsFQDNOptions)`                     | Checks if the string is a fully qualified domain name (e.g. domain.com).                                                                                                                              |
| `@IsFullWidth()`                                       | Checks if the string contains any full-width chars.                                                                                                                                                   |
| `@IsHalfWidth()`                                       | Checks if the string contains any half-width chars.                                                                                                                                                   |
| `@IsVariableWidth()`                                   | Checks if the string contains a mixture of full and half-width chars.                                                                                                                                 |
| `@IsHexColor()`                                        | Checks if the string is a hexadecimal color.                                                                                                                                                          |
| `@IsHSL()`                                             | Checks if the string is an HSL color based on [CSS Colors Level 4 specification](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value).                                                       |
| `@IsRgbColor(options?: IsRgbOptions)`                  | Checks if the string is a rgb or rgba color.                                                                                                                                                          |
| `@IsIdentityCard(locale?: string)`                     | Checks if the string is a valid identity card code.                                                                                                                                                   |
| `@IsPassportNumber(countryCode?: string)`              | Checks if the string is a valid passport number relative to a specific country code.                                                                                                                  |
| `@IsPostalCode(locale?: string)`                       | Checks if the string is a postal code.                                                                                                                                                                |
| `@IsHexadecimal()`                                     | Checks if the string is a hexadecimal number.                                                                                                                                                         |
| `@IsOctal()`                                           | Checks if the string is a octal number.                                                                                                                                                               |
| `@IsMACAddress(options?: IsMACAddressOptions)`         | Checks if the string is a MAC Address.                                                                                                                                                                |
| `@IsIP(version?: "4"\|"6")`                            | Checks if the string is an IP (version 4 or 6).                                                                                                                                                       |
| `@IsPort()`                                            | Checks if the string is a valid port number.                                                                                                                                                          |
| `@IsISBN(version?: "10"\|"13")`                        | Checks if the string is an ISBN (version 10 or 13).                                                                                                                                                   |
| `@IsEAN()`                                             | Checks if the string is an if the string is an EAN (European Article Number).                                                                                                                         |
| `@IsISIN()`                                            | Checks if the string is an ISIN (stock/security identifier).                                                                                                                                          |
| `@IsISO8601(options?: IsISO8601Options)`               | Checks if the string is a valid ISO 8601 date format. Use the option strict = true for additional checks for a valid date.                                                                            |
| `@IsJSON()`                                            | Checks if the string is valid JSON.                                                                                                                                                                   |
| `@IsJWT()`                                             | Checks if the string is valid JWT.                                                                                                                                                                    |
| `@IsObject()`                                          | Checks if the object is valid Object (null, functions, arrays will return false).                                                                                                                     |
| `@IsNotEmptyObject()`                                  | Checks if the object is not empty.                                                                                                                                                                    |
| `@IsLowercase()`                                       | Checks if the string is lowercase.                                                                                                                                                                    |
| `@IsLatLong()`                                         | Checks if the string is a valid latitude-longitude coordinate in the format lat, long.                                                                                                                |
| `@IsLatitude()`                                        | Checks if the string or number is a valid latitude coordinate.                                                                                                                                        |
| `@IsLongitude()`                                       | Checks if the string or number is a valid longitude coordinate.                                                                                                                                       |
| `@IsMobilePhone(locale: string)`                       | Checks if the string is a mobile phone number.                                                                                                                                                        |
| `@IsISO31661Alpha2()`                                  | Checks if the string is a valid ISO 3166-1 alpha-2 officially assigned country code.                                                                                                                  |
| `@IsISO31661Alpha3()`                                  | Checks if the string is a valid ISO 3166-1 alpha-3 officially assigned country code.                                                                                                                  |
| `@IsLocale()`                                          | Checks if the string is a locale.                                                                                                                                                                     |
| `@IsPhoneNumber(region: string)`                       | Checks if the string is a valid phone number using libphonenumber-js.                                                                                                                                 |
| `@IsMongoId()`                                         | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                                                                                                                     |
| `@IsMultibyte()`                                       | Checks if the string contains one or more multibyte chars.                                                                                                                                            |
| `@IsNumberString(options?: IsNumericOptions)`          | Checks if the string is numeric.                                                                                                                                                                      |
| `@IsSurrogatePair()`                                   | Checks if the string contains any surrogate pairs chars.                                                                                                                                              |
| `@IsTaxId()`                                           | Checks if the string is a valid tax ID. Default locale is `en-US`.                                                                                                                                    |
| `@IsUrl(options?: IsURLOptions)`                       | Checks if the string is a URL.                                                                                                                                                                        |
| `@IsMagnetURI()`                                       | Checks if the string is a [magnet uri format](https://en.wikipedia.org/wiki/Magnet_URI_scheme).                                                                                                       |
| `@IsUUID(version?: UUIDVersion)`                       | Checks if the string is a UUID (version 3, 4, 5 or all ).                                                                                                                                             |
| `@IsFirebasePushId()`                                  | Checks if the string is a [Firebase Push ID](https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html)                                                                          |
| `@IsUppercase()`                                       | Checks if the string is uppercase.                                                                                                                                                                    |
| `@Length(min: number, max?: number)`                   | Checks if the string's length falls in a range.                                                                                                                                                       |
| `@MinLength(min: number)`                              | Checks if the string's length is not less than given number.                                                                                                                                          |
| `@MaxLength(max: number)`                              | Checks if the string's length is not more than given number.                                                                                                                                          |
| `@Matches(pattern: RegExp, modifiers?: string)`        | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').                                                                                                    |
| `@IsMilitaryTime()`                                    | Checks if the string is a valid representation of military time in the format HH:MM.                                                                                                                  |
| `@IsTimeZone()`                                        | Checks if the string represents a valid IANA time-zone.                                                                                                                                               |
| `@IsHash(algorithm: string)`                           | Checks if the string is a hash The following types are supported:`md4`, `md5`, `sha1`, `sha256`, `sha384`, `sha512`, `ripemd128`, `ripemd160`, `tiger128`, `tiger160`, `tiger192`, `crc32`, `crc32b`. |
| `@IsMimeType()`                                        | Checks if the string matches to a valid [MIME type](https://en.wikipedia.org/wiki/Media_type) format                                                                                                  |
| `@IsSemVer()`                                          | Checks if the string is a Semantic Versioning Specification (SemVer).                                                                                                                                 |
| `@IsISSN(options?: IsISSNOptions)`                     | Checks if the string is a ISSN.                                                                                                                                                                       |
| `@IsISRC()`                                            | Checks if the string is a [ISRC](https://en.wikipedia.org/wiki/International_Standard_Recording_Code).                                                                                                |
| `@IsRFC3339()`                                         | Checks if the string is a valid [RFC 3339](https://tools.ietf.org/html/rfc3339) date.                                                                                                                 |
| `@IsStrongPassword(options?: IsStrongPasswordOptions)` | Checks if the string is a strong password.                                                                                                                                                            |
| **Array validation decorators**                        |                                                                                                                                                                                                       |
| `@ArrayContains(values: any[])`                        | Checks if array contains all values from the given array of values.                                                                                                                                   |
| `@ArrayNotContains(values: any[])`                     | Checks if array does not contain any of the given values.                                                                                                                                             |
| `@ArrayNotEmpty()`                                     | Checks if given array is not empty.                                                                                                                                                                   |
| `@ArrayMinSize(min: number)`                           | Checks if the array's length is greater than or equal to the specified number.                                                                                                                        |
| `@ArrayMaxSize(max: number)`                           | Checks if the array's length is less or equal to the specified number.                                                                                                                                |
| `@ArrayUnique(identifier?: (o) => any)`                | Checks if all array's values are unique. Comparison for objects is reference-based. Optional function can be speciefied which return value will be used for the comparsion.                           |
| **Object validation decorators**                       |
| `@IsInstance(value: any)`                              | Checks if the property is an instance of the passed value.                                                                                                                                            |
| **Other decorators**                                   |                                                                                                                                                                                                       |
| `@Allow()`                                             | Prevent stripping off the property when no other constraint is specified for it.                                                                                                                      |

## Samples

Take a look on samples in [./sample](https://github.com/arizworld/class-validator-custom-errors/tree/develop/sample) for more examples of
usages.


