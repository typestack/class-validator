# Type Validator

Wrapper over [validator.js][1] library that provides you easy way to use it with Typescript classes.

## Usage

Create your class and put some validation annotations on its properties you want to validate:

```typescript
import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "type-validator/ValidationAnnotations";

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

## Todos

* cover with tests
* more documentation and samples
* add support to load validation configuration from json and plain javascript objects 
* add support to work with vanila js

[1]: https://github.com/chriso/validator.js