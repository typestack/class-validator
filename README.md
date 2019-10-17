⚠️ In this fork the whole IsPhoneNumber Validation is removed and not replaced. ⚠️ <br/>

> The IsPhoneNumber Validator depends on the [google-libphonenumber](https://www.npmjs.com/package/google-libphonenumber) package,<br/>
> which adds an stable extra load of 450kB to your project. <br/>
> For an angular project this means that the main.js is blown up by this size, <br/>
> even if you don't use this validator.

# class-validator

[![Build Status](https://travis-ci.org/typestack/class-validator.svg?branch=master)](https://travis-ci.org/typestack/class-validator)
<img src="https://img.shields.io/badge/servrox-approved-brightgreen.svg?style=flat&link=http://servrox.solutions&link=http://servrox.solutions&logo=data:image/png;base64,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" />

Allows use of decorator and non-decorator based validation.
Internally uses [validator.js][1] to perform validation.
Class-validator works on both browser and node.js platforms.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Validation errors](#validation-errors)
  - [Validation messages](#validation-messages)
  - [Validating arrays](#validating-arrays)
  - [Validating sets](#validating-sets)
  - [Validating maps](#validating-maps)
  - [Validating nested objects](#validating-nested-objects)
  - [Validating promises](#validating-promises)
  - [Inheriting Validation decorators](#inheriting-validation-decorators)
  - [Conditional validation](#conditional-validation)
  - [Whitelisting](#whitelisting)
  - [Passing context to decorators](#passing-context-to-decorators)
  - [Skipping missing properties](#skipping-missing-properties)
  - [Validation groups](#validation-groups)
  - [Custom validation classes](#custom-validation-classes)
  - [Custom validation decorators](#custom-validation-decorators)
  - [Using service container](#using-service-container)
  - [Synchronous validation](#synchronous-validation)
  - [Manual validation](#manual-validation)
  - [Validation decorators](#validation-decorators)
  - [Defining validation schema without decorators](#defining-validation-schema-without-decorators)
  - [Validating plain objects](#validating-plain-objects)
- [Samples](#samples)
- [Extensions](#extensions)
- [Release notes](#release-notes)

## Installation

```
npm install class-validator --save
```

> Note: Please use at least npm@6 when using class-validator as from npm@6 the dependency tree is flatterned what is good for us.

## Usage

Create your class and put some validation decorators on the properties you want to validate:

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
  Max
} from "class-validator";

export class Post {
  @Length(10, 20)
  title: string;

  @Contains("hello")
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
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
  // errors is an array of validation errors
  if (errors.length > 0) {
    console.log("validation failed. errors: ", errors);
  } else {
    console.log("validation succeed");
  }
});

validateOrReject(post).catch(errors => {
  console.log("Promise rejected (validation failed). Errors: ", errors);
});
// or
async function validateOrRejectExample(input) {
  try {
    await validateOrReject(input);
  } catch (errors) {
    console.log(
      "Caught promise rejection (validation failed). Errors: ",
      errors
    );
  }
}
```

### Passing options

The `validate` function optionally expects a `ValidatorOptions` object as a second parameter.

```ts
export interface ValidatorOptions {
  skipMissingProperties?: boolean;
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  groups?: string[];
  dismissDefaultMessages?: boolean;
  validationError?: {
    target?: boolean;
    value?: boolean;
  };

  forbidUnknownValues?: boolean;
}
```

> It's highly advised to enable on `forbidUnknownValues` what prevent unknown objects to pass validation.

## Validation errors

`validate` method returns you an array of `ValidationError` objects. Each `ValidationError` is:

```typescript
{
    target: Object; // Object that was validated.
    property: string; // Object's property that haven't pass validation.
    value: any; // Value that haven't pass a validation.
    constraints?: { // Constraints that failed validation with error messages.
        [type: string]: string;
    };
    children?: ValidationError[]; // Contains all nested validation errors of the property
}
```

In our case, when we validated a Post object, we have such array of ValidationErrors:

```typescript
[{
    target: /* post object */,
    property: "title",
    value: "Hello",
    constraints: {
        length: "$property must be longer than or equal to 10 characters"
    }
}, {
    target: /* post object */,
    property: "text",
    value: "this is a great post about hell world",
    constraints: {
        contains: "text must contain a hello string"
    }
},
// and other errors
]
```

If you don't want a `target` to be exposed in validation errors, there is a special option when you use validator:

```typescript
validator.validate(post, { validationError: { target: false } });
```

This is especially useful when you send errors back over http, and you most probably don't want to expose
the whole target object.

## Validation messages

You can specify validation message in the decorator options and that message will be returned in `ValidationError`
returned by `validate` method in the case that validation for this field fails.

```typescript
import { MinLength, MaxLength } from "class-validator";

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

There are few special tokens you can use in your messages:

- `$value` - the value that is being validated
- `$property` - name of the object's property being validated
- `$target` - name of the object's class being validated
- `$constraint1`, `$constraint2`, ... `$constraintN` - constraints defined by specific validation type

Example of usage:

```typescript
import { MinLength, MaxLength } from "class-validator";

export class Post {
  @MinLength(10, {
    // here, $constraint1 will be replaced with "10", and $value with actual supplied value
    message:
      "Title is too short. Minimal length is $constraint1 characters, but actual is $value"
  })
  @MaxLength(50, {
    // here, $constraint1 will be replaced with "50", and $value with actual supplied value
    message:
      "Title is too long. Maximal length is $constraint1 characters, but actual is $value"
  })
  title: string;
}
```

Also you can provide a function, that returns a message. This way allows to create more granular messages:

```typescript
import { MinLength, MaxLength, ValidationArguments } from "class-validator";

export class Post {
  @MinLength(10, {
    message: (args: ValidationArguments) => {
      if (args.value.length === 1) {
        return "Too short, minimum length is 1 character";
      } else {
        return (
          "Too short, minimum length is " + args.constraints[0] + " characters"
        );
      }
    }
  })
  title: string;
}
```

Message function accepts `ValidationArguments` which contains following information:

- `value` - the value that is being validated
- `constraints` - array of constraints defined by specific validation type
- `targetName` - name of the object's class being validated
- `object` - object that is being validated
- `property` - name of the object's property being validated

## Validating arrays

If your field is an array and you want to perform validation of each item in the array you must specify a
special `each: true` decorator option:

```typescript
import { MinLength, MaxLength } from "class-validator";

export class Post {
  @MaxLength(20, {
    each: true
  })
  tags: string[];
}
```

This will validate each item in `post.tags` array.

## Validating sets

If your field is a set and you want to perform validation of each item in the set you must specify a
special `each: true` decorator option:

```typescript
import { MinLength, MaxLength } from "class-validator";

export class Post {
  @MaxLength(20, {
    each: true
  })
  tags: Set<string>;
}
```

This will validate each item in `post.tags` set.

## Validating maps

If your field is a map and you want to perform validation of each item in the map you must specify a
special `each: true` decorator option:

```typescript
import { MinLength, MaxLength } from "class-validator";

export class Post {
  @MaxLength(20, {
    each: true
  })
  tags: Map<string, string>;
}
```

This will validate each item in `post.tags` map.

## Validating nested objects

If your object contains nested objects and you want the validator to perform their validation too, then you need to
use the `@ValidateNested()` decorator:

```typescript
import { ValidateNested } from "class-validator";

export class Post {
  @ValidateNested()
  user: User;
}
```

## Validating promises

If your object contains property with `Promise`-returned value that should be validated, then you need to use the `@ValidatePromise()` decorator:

```typescript
import { ValidatePromise, Min } from "class-validator";

export class Post {
  @Min(0)
  @ValidatePromise()
  userId: Promise<number>;
}
```

It also works great with `@ValidateNested` decorator:

```typescript
import { ValidateNested, ValidatePromise } from "class-validator";

export class Post {
  @ValidateNested()
  @ValidatePromise()
  user: Promise<User>;
}
```

## Inheriting Validation decorators

When you define a subclass which extends from another one, the subclass will automatically inherit the parent's decorators. If a property is redefined in the descendant class decorators will be applied on it both from that and the base class.

```typescript
import {validate} from "class-validator";

class BaseContent {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

class User extends BaseContent {

    @MinLength(10)
    @MaxLength(20)
    name: string;

    @Contains("hello")
    welcome: string;

    @MinLength(20)
    password: string; /
}

let user = new User();

user.email = "invalid email";  // inherited property
user.password = "too short" // password wil be validated not only against IsString, but against MinLength as well
user.name = "not valid";
user.welcome = "helo";

validate(user).then(errors => {
    // ...
});  // it will return errors for email, title and text properties

```

## Conditional validation

The conditional validation decorator (`@ValidateIf`) can be used to ignore the validators on a property when the provided condition function returns false. The condition function takes the object being validated and must return a `boolean`.

```typescript
import { ValidateIf, IsNotEmpty } from "class-validator";

export class Post {
  otherProperty: string;

  @ValidateIf(o => o.otherProperty === "value")
  @IsNotEmpty()
  example: string;
}
```

In the example above, the validation rules applied to `example` won't be run unless the object's `otherProperty` is `"value"`.

Note that when the condition is false all validation decorators are ignored, including `isDefined`.

## Whitelisting

Even if your object is an instance of a validation class it can contain additional properties that are not defined.
If you do not want to have such properties on your object, pass special flag to `validate` method:

```typescript
import { validate } from "class-validator";
// ...
validate(post, { whitelist: true });
```

This will strip all properties that don't have any decorators. If no other decorator is suitable for your property,
you can use @Allow decorator:

```typescript
import {validate, Allow, Min} from "class-validator";

export class Post {

    @Allow()
    title: string;

    @Min(0)
    views: number;

    nonWhitelistedProperty: number;
}

let post = new Post();
post.title = 'Hello world!';
post.views = 420;

post.nonWhitelistedProperty = 69;
(post as any).anotherNonWhitelistedProperty = "something";

validate(post).then(errors => {
  // post.nonWhitelistedProperty is not defined
  // (post as any).anotherNonWhitelistedProperty is not defined
  ...
});
```

If you would rather to have an error thrown when any non-whitelisted properties are present, pass another flag to
`validate` method:

```typescript
import { validate } from "class-validator";
// ...
validate(post, { whitelist: true, forbidNonWhitelisted: true });
```

## Passing context to decorators

It's possible to pass a custom object to decorators which will be accessible on the `ValidationError` instance of the property if validation failed.

```ts
import { validate } from "class-validator";

class MyClass {
  @MinLength(32, {
    message: "EIC code must be at least 32 characters",
    context: {
      errorCode: 1003,
      developerNote: "The validated string must contain 32 or more characters."
    }
  })
  eicCode: string;
}

const model = new MyClass();

validate(model).then(errors => {
  //errors[0].contexts['minLength'].errorCode === 1003
});
```

## Skipping missing properties

Sometimes you may want to skip validation of the properties that does not exist in the validating object. This is
usually desirable when you want to update some parts of the object, and want to validate only updated parts,
but skip everything else, e.g. skip missing properties.
In such situations you will need to pass a special flag to `validate` method:

```typescript
import { validate } from "class-validator";
// ...
validate(post, { skipMissingProperties: true });
```

When skipping missing properties, sometimes you want not to skip all missing properties, some of them maybe required
for you, even if skipMissingProperties is set to true. For such cases you should use `@IsDefined()` decorator.
`@IsDefined()` is the only decorator that ignores `skipMissingProperties` option.

## Validation groups

In different situations you may want to use different validation schemas of the same object.
In such cases you can use validation groups.

```typescript
import { validate, Min, Length } from "class-validator";

export class User {
  @Min(12, {
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
  groups: undefined // the default
}); // this will not pass validation since all properties get validated regardless of their groups

validate(user, {
  groups: []
}); // this will not pass validation, (equivalent to 'groups: undefined', see above)
```

There is also a special flag `always: true` in validation options that you can use. This flag says that this validation
must be applied always no matter which group is used.

## Custom validation classes

If you have custom validation logic you can create a _Constraint class_:

1. First create a file, lets say `CustomTextLength.ts`, and define a new class:

   ```typescript
   import {
     ValidatorConstraint,
     ValidatorConstraintInterface,
     ValidationArguments
   } from "class-validator";

   @ValidatorConstraint({ name: "customText", async: false })
   export class CustomTextLength implements ValidatorConstraintInterface {
     validate(text: string, args: ValidationArguments) {
       return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
     }

     defaultMessage(args: ValidationArguments) {
       // here you can provide default error message if validation failed
       return "Text ($value) is too short or too long!";
     }
   }
   ```

   We marked our class with `@ValidatorConstraint` decorator.
   You can also supply a validation constraint name - this name will be used as "error type" in ValidationError.
   If you will not supply a constraint name - it will be auto-generated.

   Our class must implement `ValidatorConstraintInterface` interface and its `validate` method,
   which defines validation logic. If validation succeeds, method returns true, otherwise false.
   Custom validator can be asynchronous, if you want to perform validation after some asynchronous
   operations, simply return a promise with boolean inside in `validate` method.

   Also we defined optional method `defaultMessage` which defines a default error message,
   in the case that the decorator's implementation doesn't set an error message.

2) Then you can use your new validation constraint in your class:

   ```typescript
   import { Validate } from "class-validator";
   import { CustomTextLength } from "./CustomTextLength";

   export class Post {
     @Validate(CustomTextLength, {
       message: "Title is too short or long!"
     })
     title: string;
   }
   ```

   Here we set our newly created `CustomTextLength` validation constraint for `Post.title`.

3) And use validator as usual:

   ```typescript
   import { validate } from "class-validator";

   validate(post).then(errors => {
     // ...
   });
   ```

You can also pass constraints to your validator, like this:

```typescript
import { Validate } from "class-validator";
import { CustomTextLength } from "./CustomTextLength";

export class Post {
  @Validate(CustomTextLength, [3, 20], {
    message: "Wrong post title"
  })
  title: string;
}
```

And use them from `validationArguments` object:

```typescript
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, validationArguments: ValidationArguments) {
    return (
      text.length > validationArguments.constraints[0] &&
      text.length < validationArguments.constraints[1]
    );
  }
}
```

## Custom validation decorators

You can also create a custom decorators. Its the most elegant way of using a custom validations.
Lets create a decorator called `@IsLongerThan`:

1. Create a decorator itself:

   ```typescript
   import {
     registerDecorator,
     ValidationOptions,
     ValidationArguments
   } from "class-validator";

   export function IsLongerThan(
     property: string,
     validationOptions?: ValidationOptions
   ) {
     return function(object: Object, propertyName: string) {
       registerDecorator({
         name: "isLongerThan",
         target: object.constructor,
         propertyName: propertyName,
         constraints: [property],
         options: validationOptions,
         validator: {
           validate(value: any, args: ValidationArguments) {
             const [relatedPropertyName] = args.constraints;
             const relatedValue = (args.object as any)[relatedPropertyName];
             return (
               typeof value === "string" &&
               typeof relatedValue === "string" &&
               value.length > relatedValue.length
             ); // you can return a Promise<boolean> here as well, if you want to make async validation
           }
         }
       });
     };
   }
   ```

2. Put it to use:

   ```typescript
   import { IsLongerThan } from "./IsLongerThan";

   export class Post {
     title: string;

     @IsLongerThan("title", {
       /* you can also use additional validation options, like "groups" in your custom validation decorators. "each" is not supported */
       message: "Text must be longer than the title"
     })
     text: string;
   }
   ```

In your custom decorators you can also use `ValidationConstraint`.
Lets create another custom validation decorator called `IsUserAlreadyExist`:

1. Create a ValidationConstraint and decorator:

   ```typescript
   import {
     registerDecorator,
     ValidationOptions,
     ValidatorConstraint,
     ValidatorConstraintInterface,
     ValidationArguments
   } from "class-validator";

   @ValidatorConstraint({ async: true })
   export class IsUserAlreadyExistConstraint
     implements ValidatorConstraintInterface {
     validate(userName: any, args: ValidationArguments) {
       return UserRepository.findOneByName(userName).then(user => {
         if (user) return false;
         return true;
       });
     }
   }

   export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
     return function(object: Object, propertyName: string) {
       registerDecorator({
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         constraints: [],
         validator: IsUserAlreadyExistConstraint
       });
     };
   }
   ```

   note that we marked our constraint that it will by async by adding `{ async: true }` in validation options.

2. And put it to use:

   ```typescript
   import { IsUserAlreadyExist } from "./IsUserAlreadyExist";

   export class User {
     @IsUserAlreadyExist({
       message: "User $value already exists. Choose another name."
     })
     name: string;
   }
   ```

## Using service container

Validator supports service container in the case if want to inject dependencies into your custom validator constraint
classes. Here is example how to integrate it with [typedi][2]:

```typescript
import { Container } from "typedi";
import { useContainer, Validator } from "class-validator";

// do this somewhere in the global application level:
useContainer(Container);
let validator = Container.get(Validator);

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraint-s
```

## Synchronous validation

If you want to perform a simple non async validation you can use `validateSync` method instead of regular `validate`
method. It has the same arguments as `validate` method. But note, this method **ignores** all async validations
you have.

## Manual validation

There are several method exist in the Validator that allows to perform non-decorator based validation:

```typescript
import { Validator } from "class-validator";

// Validation methods
const validator = new Validator();

// common validation methods
validator.isDefined(value); // Checks if value is defined ("!==undefined").
validator.equals(value, comparison); // Checks if value matches ("===") the comparison.
validator.notEquals(value, comparison); // Checks if value does not match ("!==") the comparison.
validator.isEmpty(value); // Checks if given value is empty (=== '', === null, === undefined).
validator.isNotEmpty(value); // Checks if given value is not empty (!== '', !== null, !== undefined).
validator.isIn(value, possibleValues); // Checks if given value is in a array of allowed values.
validator.isNotIn(value, possibleValues); // Checks if given value not in a array of allowed values.

// type validation methods
validator.isBoolean(value); // Checks if a given value is a real boolean.
validator.isDate(value); // Checks if a given value is a real date.
validator.isString(value); // Checks if a given value is a real string.
validator.isArray(value); // Checks if a given value is an array.
validator.isNumber(value, options); // Checks if a given value is a real number.
validator.isInt(value); // Checks if value is an integer.
validator.isEnum(value, entity); // Checks if value is valid for a certain enum entity.

// number validation methods
validator.isDivisibleBy(value, num); // Checks if value is a number that's divisible by another.
validator.isPositive(value); // Checks if the value is a positive number.
validator.isNegative(value); // Checks if the value is a negative number.
validator.min(num, min); // Checks if the first number is greater than or equal to the second.
validator.max(num, max); // Checks if the first number is less than or equal to the second.

// date validation methods
validator.minDate(date, minDate); // Checks if the value is a date that's after the specified date.
validator.maxDate(date, minDate); // Checks if the value is a date that's before the specified date.

// string-type validation methods
validator.isBooleanString(str); // Checks if a string is a boolean.
validator.isNumberString(str); // Checks if the string is numeric.

// string validation methods
validator.contains(str, seed); // Checks if the string contains the seed.
validator.notContains(str, seed); // Checks if the string does not contain the seed.
validator.isAlpha(str); // Checks if the string contains only letters (a-zA-Z).
validator.isAlphanumeric(str); // Checks if the string contains only letters and numbers.
validator.isDecimal(str, options); // Checks if the string is a valid decimal value.
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
validator.isObject(object); // Checks if the object is valid Object (null, functions, arrays will return false)
validator.isNotEmptyObject(object); // Checks if the object is not empty
validator.isLowercase(str); // Checks if the string is lowercase.
validator.isLatLong(str); // Checks if the string is lowercase.
validator.isLatitude(str); // Checks if the string is lowercase.
validator.isLongtitude(str); // Checks if the string is lowercase.
validator.isMobilePhone(str, locale); // Checks if the string is a mobile phone number.
validator.isISO31661Alpha2(str); // Check if the string is a valid ISO 3166-1 alpha-2
validator.isISO31661Alpha3(str); // Check if the string is a valid ISO 3166-1 alpha-3
validator.isMongoId(str); // Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
validator.isMultibyte(str); // Checks if the string contains one or more multibyte chars.
validator.isSurrogatePair(str); // Checks if the string contains any surrogate pairs chars.
validator.isURL(str, options); // Checks if the string is an url.
validator.isUUID(str, version); // Checks if the string is a UUID (version 3, 4 or 5).
validator.isUppercase(str); // Checks if the string is uppercase.
validator.length(str, min, max); // Checks if the string's length falls in a range.
validator.minLength(str, min); // Checks if the string's length is not less than given number.
validator.maxLength(str, max); // Checks if the string's length is not more than given number.
validator.matches(str, pattern, modifiers); // Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').
validator.isMilitaryTime(str); // Checks if the string is a valid representation of military time in the format HH:MM.

// array validation methods
validator.arrayContains(array, values); // Checks if array contains all values from the given array of values.
validator.arrayNotContains(array, values); // Checks if array does not contain any of the given values.
validator.arrayNotEmpty(array); // Checks if given array is not empty.
validator.arrayMinSize(array, min); // Checks if array's length is at least `min` number.
validator.arrayMaxSize(array, max); // Checks if array's length is as most `max` number.
validator.arrayUnique(array); // Checks if all array's values are unique. Comparison for objects is reference-based.

// object validation methods
validator.isInstance(value, target); // Checks value is an instance of the target.
```

## Validation decorators

| Decorator                                       | Description                                                                                                                                           |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Common validation decorators**                |
| `@IsDefined(value: any)`                        | Checks if value is defined (!== undefined, !== null). This is the only decorator that ignores skipMissingProperties option.                           |
| `@IsOptional()`                                 | Checks if given value is empty (=== null, === undefined) and if so, ignores all the validators on the property.                                       |
| `@Equals(comparison: any)`                      | Checks if value equals ("===") comparison.                                                                                                            |
| `@NotEquals(comparison: any)`                   | Checks if value not equal ("!==") comparison.                                                                                                         |
| `@IsEmpty()`                                    | Checks if given value is empty (=== '', === null, === undefined).                                                                                     |
| `@IsNotEmpty()`                                 | Checks if given value is not empty (!== '', !== null, !== undefined).                                                                                 |
| `@IsIn(values: any[])`                          | Checks if value is in a array of allowed values.                                                                                                      |
| `@IsNotIn(values: any[])`                       | Checks if value is not in a array of disallowed values.                                                                                               |
| **Type validation decorators**                  |
| `@IsBoolean()`                                  | Checks if a value is a boolean.                                                                                                                       |
| `@IsDate()`                                     | Checks if the value is a date.                                                                                                                        |
| `@IsString()`                                   | Checks if the string is a string.                                                                                                                     |
| `@IsNumber(options: IsNumberOptions)`           | Checks if the value is a number.                                                                                                                      |
| `@IsInt()`                                      | Checks if the value is an integer number.                                                                                                             |
| `@IsArray()`                                    | Checks if the value is an array                                                                                                                       |
| `@IsEnum(entity: object)`                       | Checks if the value is an valid enum                                                                                                                  |
| **Number validation decorators**                |
| `@IsDivisibleBy(num: number)`                   | Checks if the value is a number that's divisible by another.                                                                                          |
| `@IsPositive()`                                 | Checks if the value is a positive number.                                                                                                             |
| `@IsNegative()`                                 | Checks if the value is a negative number.                                                                                                             |
| `@Min(min: number)`                             | Checks if the given number is greater than or equal to given number.                                                                                  |
| `@Max(max: number)`                             | Checks if the given number is less than or equal to given number.                                                                                     |
| **Date validation decorators**                  |
| `@MinDate(date: Date)`                          | Checks if the value is a date that's after the specified date.                                                                                        |
| `@MaxDate(date: Date)`                          | Checks if the value is a date that's before the specified date.                                                                                       |  |
| **String-type validation decorators**           |
| `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false").                                                                                          |
| `@IsDateString()`                               | Checks if a string is a complete representation of a date (e.g. "2017-06-07T14:34:08.700Z", "2017-06-07T14:34:08.700 or "2017-06-07T14:34:08+04:00"). |
| `@IsNumberString()`                             | Checks if a string is a number.                                                                                                                       |
| **String validation decorators**                |
| `@Contains(seed: string)`                       | Checks if the string contains the seed.                                                                                                               |
| `@NotContains(seed: string)`                    | Checks if the string not contains the seed.                                                                                                           |
| `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z).                                                                                                  |
| `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers.                                                                                               |
| `@IsDecimal(options?: IsDecimalOptions)`        | Checks if the string is a valid decimal value. Default IsDecimalOptions are `force_decimal=False`, `decimal_digits: '1,'`, `locale: 'en-US',`         |
| `@IsAscii()`                                    | Checks if the string contains ASCII chars only.                                                                                                       |
| `@IsBase64()`                                   | Checks if a string is base64 encoded.                                                                                                                 |
| `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range.                                                                                            |
| `@IsCreditCard()`                               | Checks if the string is a credit card.                                                                                                                |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount.                                                                                                      |
| `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.                                                                                                                     |
| `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com).                                                                              |
| `@IsFullWidth()`                                | Checks if the string contains any full-width chars.                                                                                                   |
| `@IsHalfWidth()`                                | Checks if the string contains any half-width chars.                                                                                                   |
| `@IsVariableWidth()`                            | Checks if the string contains a mixture of full and half-width chars.                                                                                 |
| `@IsHexColor()`                                 | Checks if the string is a hexadecimal color.                                                                                                          |
| `@IsHexadecimal()`                              | Checks if the string is a hexadecimal number.                                                                                                         |
| `@IsIP(version?: "4"\|"6")`                     | Checks if the string is an IP (version 4 or 6).                                                                                                       |
| `@IsISBN(version?: "10"\|"13")`                 | Checks if the string is an ISBN (version 10 or 13).                                                                                                   |
| `@IsISIN()`                                     | Checks if the string is an ISIN (stock/security identifier).                                                                                          |
| `@IsISO8601()`                                  | Checks if the string is a valid ISO 8601 date.                                                                                                        |
| `@IsJSON()`                                     | Checks if the string is valid JSON.                                                                                                                   |
| `@IsObject()`                                   | Checks if the object is valid Object (null, functions, arrays will return false).                                                                     |
| `@IsNotEmptyObject()`                           | Checks if the object is not empty.                                                                                                                    |
| `@IsLowercase()`                                | Checks if the string is lowercase.                                                                                                                    |
| `@IsLatLong()`                                  | Checks if the string is a valid latitude-longitude coordinate in the format lat,long                                                                  |
| `@IsLatitude()`                                 | Checks if the string or number is a valid latitude coordinate                                                                                         |
| `@IsLongitude()`                                | Checks if the string or number is a valid longitude coordinate                                                                                        |
| `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number.                                                                                                        |
| `@IsISO31661Alpha2()`                           | Checks if the string is a valid [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) officially assigned country code.              |
| `@IsISO31661Alpha3()`                           | Checks if the string is a valid [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) officially assigned country code.              |
| `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                                                                     |
| `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars.                                                                                            |
| `@IsNumberString()`                             | Checks if the string is numeric.                                                                                                                      |
| `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars.                                                                                              |
| `@IsUrl(options?: IsURLOptions)`                | Checks if the string is an url.                                                                                                                       |
| `@IsUUID(version?: "3"\|"4"\|"5")`              | Checks if the string is a UUID (version 3, 4 or 5).                                                                                                   |
| `@IsUppercase()`                                | Checks if the string is uppercase.                                                                                                                    |
| `@Length(min: number, max?: number)`            | Checks if the string's length falls in a range.                                                                                                       |
| `@MinLength(min: number)`                       | Checks if the string's length is not less than given number.                                                                                          |
| `@MaxLength(max: number)`                       | Checks if the string's length is not more than given number.                                                                                          |
| `@Matches(pattern: RegExp, modifiers?: string)` | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').                                                    |
| `@IsMilitaryTime()`                             | Checks if the string is a valid representation of military time in the format HH:MM.                                                                  |
| **Array validation decorators**                 |
| `@ArrayContains(values: any[])`                 | Checks if array contains all values from the given array of values.                                                                                   |
| `@ArrayNotContains(values: any[])`              | Checks if array does not contain any of the given values.                                                                                             |
| `@ArrayNotEmpty()`                              | Checks if given array is not empty.                                                                                                                   |
| `@ArrayMinSize(min: number)`                    | Checks if array's length is as minimal this number.                                                                                                   |
| `@ArrayMaxSize(max: number)`                    | Checks if array's length is as maximal this number.                                                                                                   |
| `@ArrayUnique()`                                | Checks if all array's values are unique. Comparison for objects is reference-based.                                                                   |
| **Object validation decorators**                |
| `@IsInstance(value: any)`                       | Checks if the property is an instance of the passed value.                                                                                            |
| **Other decorators**                            |
| `@Allow()`                                      | Prevent stripping off the property when no other constraint is specified for it.                                                                      |

## Defining validation schema without decorators

You can define your validation schemas without decorators:

- you can define it in the separate object
- you can define it in the `.json` file

This feature maybe useful in the cases if:

- are using es5/es6 and don't have decorators available
- you don't have a classes, and instead using interfaces
- you don't want to use model at all
- you want to have a validation schema separate of your model
- you want beautiful json-schema based validation models
- you simply hate decorators

Here is an example of using it:

1. Create a schema object:

   ```typescript
   import { ValidationSchema } from "class-validator";
   export let UserValidationSchema: ValidationSchema = {
     // using interface here is not required, its just for type-safety
     name: "myUserSchema", // this is required, and must be unique
     properties: {
       firstName: [
         {
           type: "minLength", // validation type. All validation types are listed in ValidationTypes class.
           constraints: [2]
         },
         {
           type: "maxLength",
           constraints: [20]
         }
       ],
       lastName: [
         {
           type: "minLength",
           constraints: [2]
         },
         {
           type: "maxLength",
           constraints: [20]
         }
       ],
       email: [
         {
           type: "isEmail"
         }
       ]
     }
   };
   ```

   Same schema can be provided in `.json` file, depend on your wish.

2. Register your schema:

   ```typescript
   import { registerSchema } from "class-validator";
   import { UserValidationSchema } from "./UserValidationSchema";
   registerSchema(UserValidationSchema); // if schema is in .json file, then you can simply do registerSchema(require("path-to-schema.json"));
   ```

   Better to put this code in a global place, maybe when you bootstrap your application, for example in `app.ts`.

3. Validate your object using validation schema:

   ```typescript
   import { validate } from "class-validator";
   const user = {
     firstName: "Johny",
     secondName: "Cage",
     email: "johny@cage.com"
   };
   validate("myUserSchema", user).then(errors => {
     if (errors.length > 0) {
       console.log("Validation failed: ", errors);
     } else {
       console.log("Validation succeed.");
     }
   });
   ```

   That's it. Here `"myUserSchema"` is the name of our validation schema.
   `validate` method will perform validation based on this schema

## Validating plain objects

Due to nature of the decorators, the validated object has to be instantiated using `new Class()` syntax. If you have your class defined using class-validator decorators and you want to validate plain JS object (literal object or returned by JSON.parse), you need to transform it to the class instance (e.g. using [class-transformer](https://github.com/pleerock/class-transformer)) or just use the [class-transformer-validator](https://github.com/19majkel94/class-transformer-validator) extension which can do that for you.

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/class-validator/tree/master/sample) for more examples of
usages.

## Extensions

There are several extensions that simplify class-validator integration with other modules:

- [class-validator integration](https://github.com/19majkel94/class-transformer-validator) with [class-transformer](https://github.com/pleerock/class-transformer)
- [class-validator-rule](https://github.com/yantrab/class-validator-rule)
- [ngx-dynamic-form-builder](https://github.com/EndyKaufman/ngx-dynamic-form-builder)

## Release notes

See information about breaking changes and release notes [here][3].

[1]: https://github.com/chriso/validator.js
[2]: https://github.com/pleerock/typedi
[3]: CHANGELOG.md
