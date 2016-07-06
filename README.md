# class-validator

Allows use of decorator and non-decorator based validation. Internally uses [validator.js][1] to perform validation.

## Installation

1. Install module:

    `npm install class-validator --save`

2. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    and use it somewhere in the global place of your app:

    * for nodejs: `require("es6-shim")` in your app's entry point (for example in `app.ts`)
    * for browser: `<script src="node_modules/es6-shim/es6-shim.js">` in your `index.html`

    For node.js users this step is only required if you are using old versions of node.

## Usage

Create your class and put some validation decorators on the properties you want to validate:

```typescript
import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from "class-validator";

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

validate(post).then(errors => { // errors is an array of validation errors
    if (errors.length > 0) {
        console.log("validation failed. errors: ", errors);
    } else {
        console.log("validation succeed");
    }
});
```

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
        length: "$property must be shorter than 10 characters"
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
validator.validate(post, { error: { target: false } });
```

This is especially useful when you send errors back over http, and you most probably don't want to expose
the whole target object.

## Validation messages

You can specify validation message in the decorator options and that message will be returned in `ValidationError`
returned by `validate` method in the case that validation for this field fails.

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

There are few special tokens you can use in your messages:
* `$value` - the value that is being validated
* `$property` - name of the object's property being validated
* `$target` - name of the object's class being validated
* `$constraint1`, `$constraint2`, ... `$constraintN` - constraints defined by specific validation type

Example of usage:

```typescript
import {MinLength, MaxLength} from "class-validator";

export class Post {

    @MinLength(10, { // here, $constraint1 will be replaced with "10", and $value with actual supplied value
        message: "Title is too short. Minimal length is $constraint1 characters, but actual is $value"
    })
    @MaxLength(50, { // here, $constraint1 will be replaced with "50", and $value with actual supplied value
        message: "Title is too long. Maximal length is $constraint1 characters, but actual is $value"
    })
    title: string;
}
```

Also you can provide a function, that returns a message. This way allows to create more granular messages:

```typescript
import {MinLength, MaxLength, ValidationArguments} from "class-validator";

export class Post {

    @MinLength(10, {
        message: (args: ValidationArguments) => {
            if (args.value.length === 1) {
                return "Too short, minimum length is 1 character";
            } else {
                return "Too short, minimum length is " + args.constraints[0] + " characters";
            }
        }
    })
    title: string;
}
```

Message function accepts `ValidationArguments` which contains following information:
* `value` - the value that is being validated
* `constraints` - array of constraints defined by specific validation type
* `targetName` - name of the object's class being validated
* `object` - object that is being validated
* `property` - name of the object's property being validated

## Validating arrays

If your field is an array and you want to perform validation of each item in the array you must specify a
special `each: true` decorator option:

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

If your object contains nested objects and you want the validator to perform their validation too, then you need to
use the `@ValidateNested()` decorator:

```typescript
import {ValidateNested} from "class-validator";

export class Post {

    @ValidateNested()
    user: User;

}
```

## Skipping missing properties

Sometimes you may want to skip validation of the properties that does not exist in the validating object. This is
usually desirable when you want to update some parts of the object, and want to validate only updated parts,
but skip everything else, e.g. skip missing properties.
In such situations you will need to pass a special flag to `validate` method:

```typescript
import {validate} from "class-validator";
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
import {validate, Min, Length} from "class-validator";

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
    groups: []
}); // this will pass validation
```

There is also a special flag `always: true` in validation options that you can use. This flag says that this validation
must be applied always no matter which group is used.

## Custom validation classes

If you have custom validation logic you can create a *Constraint class*:

1. First create a file, lets say `CustomTextLength.ts`, and define a new class:

    ```typescript
    import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

    @ValidatorConstraint()
    export class CustomTextLength implements ValidatorConstraintInterface {

        validate(text: string, args: ValidationArguments) {
            return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
        }

        defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
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


2. Then you can use your new validation constraint in your class:

    ```typescript
    import {Validate} from "class-validator";
    import {CustomTextLength} from "./CustomTextLength";

    export class Post {

        @Validate(CustomTextLength, {
            message: "Title is too short or long!"
        })
        title: string;

    }
    ```

    Here we set our newly created `CustomTextLength` validation constraint for `Post.title`.

3. And use validator as usual:

    ```typescript
    import {validate} from "class-validator";

    validate(post).then(errors => {
        // ...
    });
    ```

You can also pass constraints to your validator, like this:

```typescript
import {Validate} from "class-validator";
import {CustomTextLength} from "./CustomTextLength";

export class Post {

    @Validate(CustomTextLength, [3, 20], {
        message: "Wrong post title"
    })
    title: string;

}
```

And use them from `validationArguments` object:

```typescript
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string, validationArguments: ValidationArguments) {
        return text.length > validationArguments.constraints[0] && text.length < validationArguments.constraints[1];
    }

}
```

## Custom validation decorators

You can also create a custom decorators. Its the most elegant way of using a custom validations.
Lets create a decorator called `@IsLongerThan`:

1. Create a decorator itself:

    ```typescript
    import {registerDecorator, ValidationOptions} from "class-validator";

    export function IsLongerThan(property: string, validationOptions?: ValidationOptions) {
       return function (object: Object, propertyName: string) {
           registerDecorator(object, propertyName, validationOptions, [property], "is_longer_than", (value, args) => {
               const [relatedPropertyName] = args.constraints;
               const relatedValue = (args.object as any)[relatedPropertyName];
               return  typeof value === "string" &&
                       typeof relatedValue === "string" &&
                       value.length > relatedValue.length; // you can return a Promise<boolean> here as well, if you want to make async validation
           });
       };
    }
    ```

2. Put it to use:

    ```typescript
    import {IsLongerThan} from "./IsLongerThan";

    export class Post {

        title: string;

        @IsLongerThan("title", {
           /* you can also use additional validation options, like "each", "groups" in your custom validation decorators */
           message: "Text must be longer than the title"
        })
        text: string;

    }
    ```

In your custom decorators you can also use `ValidationConstraint`.
Lets create another custom validation decorator called `IsUserAlreadyExist`:

1. Create a ValidationConstraint and decorator:

    ```typescript
    import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

    @ValidatorConstraint()
    export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {

        validate(userName: any, args: ValidationArguments) {
            return UserRepository.findOneByName(userName).then(user => {
                if (user) return false;
                return true;
            });
        }

    }

    export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
       return function (object: Object, propertyName: string) {
           registerDecorator(object, propertyName, validationOptions, [], IsUserAlreadyExistConstraint);
       };
    }
    ```

2. And put it to use:

    ```typescript
    import {IsUserAlreadyExist} from "./IsUserAlreadyExist";

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
import {Container} from "typedi";
import {useContainer} from "class-validator";

// do this somewhere in the global application level:
useContainer(Container);
let validator = Container.get(Validator);

// now everywhere you can inject Validator class which will go from the container
// also you can inject classes using constructor injection into your custom ValidatorConstraint-s
```

## Manual validation

There are several method exist in the Validator that allows to perform non-decorator based validation:

```typescript
import {Validator} from "class-validator";

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
validator.isNumber(value); // Checks if a given value is a real number.
validator.isInt(value); // Checks if value is an integer.

// number validation methods
validator.isDivisibleBy(value, num); // Checks if value is a number that's divisible by another.
validator.isPositive(value); // Checks if the value is a positive number.
validator.isNegative(value); // Checks if the value is a negative number.
validator.max(num, max); // Checks if the first number is greater than second.
validator.min(num, min); // Checks if the first number is less than second.

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
validator.minLength(str, min); // Checks if the string's length is not less than given number.
validator.maxLength(str, max); // Checks if the string's length is not more than given number.
validator.matches(str, pattern, modifiers); // Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').

// array validation methods
validator.arrayContains(array, values); // Checks if array contains all values from the given array of values.
validator.arrayNotContains(array, values); // Checks if array does not contain any of the given values.
validator.arrayNotEmpty(array); // Checks if given array is not empty.
validator.arrayMinSize(array, min); // Checks if array's length is at least `min` number.
validator.arrayMaxSize(array, max); // Checks if array's length is as most `max` number.
validator.arrayUnique(array); // Checks if all array's values are unique. Comparison for objects is reference-based.
```

## Validation decorators

| Decorator                                       | Description                                                                                                                      |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Common validation decorators**                                                                                                                                                   |
| `@IsDefined(value: any)`                        | Checks if value is defined (!== undefined, !== null). This is the only decorator that ignores skipMissingProperties option.      |
| `@Equals(comparison: any)`                      | Checks if value equals ("===") comparison.                                                                                       |
| `@NotEquals(comparison: any)`                   | Checks if value not equal ("!==") comparison.                                                                                    |
| `@IsEmpty()`                                    | Checks if given value is empty (=== '', === null, === undefined).                                                                |
| `@IsNotEmpty()`                                 | Checks if given value is not empty (!== '', !== null, !== undefined).                                                            |
| `@IsIn(values: any[])`                          | Checks if value is in a array of allowed values.                                                                                 |
| `@IsNotIn(values: any[])`                       | Checks if value is not in a array of disallowed values.                                                                          |
| **Type validation decorators**                                                                                                                                                     |
| `@IsBoolean()`                                  | Checks if a value is a boolean.                                                                                                  |
| `@IsDate()`                                     | Checks if the string is a date.                                                                                                  |
| `@IsString()`                                   | Checks if the string is a string.                                                                                                |
| `@IsNumber()`                                   | Checks if the string is a number.                                                                                                |
| `@IsInt()`                                      | Checks if the value is an integer number.                                                                                        |
| **Number validation decorators**                                                                                                                                                   |
| `@IsDivisibleBy(num: number)`                   | Checks if the value is a number that's divisible by another.                                                                     |
| `@IsPositive()`                                 | Checks if the value is a positive number.                                                                                        |
| `@IsNegative()`                                 | Checks if the value is a negative number.                                                                                        |
| `@Max(max: number)`                             | Checks if the given number is greater than given number.                                                                         |
| `@Min(min: number)`                             | Checks if the given number is less than given number.                                                                            |
| **Date validation decorators**                                                                                                                                                     |
| `@MinDate(date: Date)`                          | Checks if the value is a date that's after the specified date.                                                                   |
| `@MaxDate(date: Date)`                          | Checks if the value is a date that's before the specified date.                                                                  |                                                                                                                                                  |
| **String-type validation decorators**                                                                                                                                              |
| `@IsBooleanString()`                            | Checks if a string is a boolean (e.g. is "true" or "false").                                                                     |
| `@IsDateString()`                               | Checks if a string is a date.                                                                                                    |
| `@IsNumberString()`                             | Checks if a string is a number.                                                                                                  |
| **String validation decorators**                                                                                                                                                   |
| `@Contains(seed: string)`                       | Checks if the string contains the seed.                                                                                          |
| `@NotContains(seed: string)`                    | Checks if the string not contains the seed.                                                                                      |
| `@IsAlpha()`                                    | Checks if the string contains only letters (a-zA-Z).                                                                             |
| `@IsAlphanumeric()`                             | Checks if the string contains only letters and numbers.                                                                          |
| `@IsAscii()`                                    | Checks if the string contains ASCII chars only.                                                                                  |
| `@IsBase64()`                                   | Checks if a string is base64 encoded.                                                                                            |
| `@IsByteLength(min: number, max?: number)`      | Checks if the string's length (in bytes) falls in a range.                                                                       |
| `@IsCreditCard()`                               | Checks if the string is a credit card.                                                                                           |
| `@IsCurrency(options?: IsCurrencyOptions)`      | Checks if the string is a valid currency amount.                                                                                 |
| `@IsEmail(options?: IsEmailOptions)`            | Checks if the string is an email.                                                                                                |
| `@IsFQDN(options?: IsFQDNOptions)`              | Checks if the string is a fully qualified domain name (e.g. domain.com).                                                         |
| `@IsFullWidth()`                                | Checks if the string contains any full-width chars.                                                                              |
| `@IsHalfWidth()`                                | Checks if the string contains any half-width chars.                                                                              |
| `@IsVariableWidth()`                            | Checks if the string contains a mixture of full and half-width chars.                                                            |
| `@IsHexColor()`                                 | Checks if the string is a hexadecimal color.                                                                                     |
| `@IsHexadecimal()`                              | Checks if the string is a hexadecimal number.                                                                                    |
| `@IsIP(version?: "4"|"6")`                      | Checks if the string is an IP (version 4 or 6).                                                                                  |
| `@IsISBN(version?: "10"|"13")`                  | Checks if the string is an ISBN (version 10 or 13).                                                                              |
| `@IsISIN()`                                     | Checks if the string is an ISIN (stock/security identifier).                                                                     |
| `@IsISO8601()`                                  | Checks if the string is a valid ISO 8601 date.                                                                                   |
| `@IsJSON()`                                     | Checks if the string is valid JSON.                                                                                              |
| `@IsLowercase()`                                | Checks if the string is lowercase.                                                                                               |
| `@IsMobilePhone(locale: string)`                | Checks if the string is a mobile phone number.                                                                                   |
| `@IsMongoId()`                                  | Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.                                                |
| `@IsMultibyte()`                                | Checks if the string contains one or more multibyte chars.                                                                       |
| `@IsNumericString()`                            | Checks if the string is numeric.                                                                                                 |
| `@IsSurrogatePair()`                            | Checks if the string contains any surrogate pairs chars.                                                                         |
| `@IsUrl(options?: IsURLOptions)`                | Checks if the string is an url.                                                                                                  |
| `@IsUUID(version?: "3"|"4"|"5")`                | Checks if the string is a UUID (version 3, 4 or 5).                                                                              |
| `@IsUppercase()`                                | Checks if the string is uppercase.                                                                                               |
| `@Length(min: number, max?: number)`            | Checks if the string's length falls in a range.                                                                                  |
| `@MinLength(min: number)`                       | Checks if the string's length is not less than given number.                                                                     |
| `@MaxLength(max: number)`                       | Checks if the string's length is not more than given number.                                                                     |
| `@Matches(pattern: RegExp, modifiers?: string)` | Checks if string matches the pattern. Either matches('foo', /foo/i) or matches('foo', 'foo', 'i').                               |
| **Array validation decorators**                                                                                                                                                    |
| `@ArrayContains(values: any[])`                 | Checks if array contains all values from the given array of values.                                                              |
| `@ArrayNotContains(values: any[])`              | Checks if array does not contain any of the given values.                                                                        |
| `@ArrayNotEmpty()`                              | Checks if given array is not empty.                                                                                              |
| `@ArrayMinSize(min: number)`                    | Checks if array's length is as minimal this number.                                                                              |
| `@ArrayMaxSize(max: number)`                    | Checks if array's length is as maximal this number.                                                                              |
| `@ArrayUnique()`                                | Checks if all array's values are unique. Comparison for objects is reference-based.                                              |

## Defining validation schema without decorators

You can define your validation schemas without decorators:

* you can define it in the separate object
* you can define it in the `.json` file

This feature maybe useful in the cases if:

* are using es5/es6 and don't have decorators available
* you don't have a classes, and instead using interfaces
* you don't want to use model at all
* you want to have a validation schema separate of your model
* you want beautiful json-schema based validation models
* you simply hate decorators

Here is an example of using it:

1. Create a schema object:

    ```typescript
    import {ValidationSchema} from "class-validator";
    export let UserValidationSchema: ValidationSchema = { // using interface here is not required, its just for type-safety
        name: "myUserSchema", // this is required, and must be unique
        properties: {
            firstName: [{
                type: "minLength", // validation type. All validation types are listed in ValidationTypes class.
                constraints: [2]
            }, {
                type: "maxLength",
                constraints: [20]
            }],
            lastName: [{
                type: "minLength",
                constraints: [2]
            }, {
                type: "maxLength",
                constraints: [20]
            }],
            email: [{
                type: "isEmail"
            }]
        }
    };
    ```

    Same schema can be provided in `.json` file, depend on your wish.

2. Register your schema:

    ```typescript
    import {registerSchema} from "class-validator";
    import {UserValidationSchema} from "./UserValidationSchema";
    registerSchema(schema); // if schema is in .json file, then you can simply do registerSchema(require("path-to-schema.json"));
    ```

    Better to put this code in a global place, maybe when you bootstrap your application, for example in `app.ts`.

3. Validate your object using validation schema:

    ```typescript
    import {validate} from "class-validator";
    const user = { firstName: "Johny", secondName: "Cage", email: "johny@cage.com" };
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

## Samples

Take a look on samples in [./sample](https://github.com/pleerock/class-validator/tree/master/sample) for more examples of
usages.


## Release notes

See information about breaking changes and release notes [here](https://github.com/pleerock/class-validator/tree/master/doc/release-notes.md).

[1]: https://github.com/chriso/validator.js
[2]: https://github.com/pleerock/typedi
