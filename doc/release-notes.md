# Release notes

**0.6.0**

* added `@ValidateIf` decorator, see conditional validation in docs.
* breaking change with `@ValidateNested` on arrays: Validator now groups the validation errors by sub-object, rather than them all being grouped together. See #32 for a demonstration of the updated structure.

**0.5.0**

* async validations must be marked with `{ async: true }` option now.
This is optional, but it helps to determine which decorators are async to prevent their execution in `validateSync` method.
* added `validateSync` method that performs non asynchronous validation and ignores validations that marked with `async: true`.
* there is a breaking change in `registerDecorator` method. Now it accepts options object.
* breaking change with `@ValidatorConstraint` decorator. Now it accepts option object instead of single name.

**0.4.1**

* fixed issue with wrong source maps packaged

**0.4.0**

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
* added support of separate validation schemas
* added support of default validation messages
* added support of special tokens in validation messages
* added support of message functions in validation options
* added support of custom decorators
* if no groups were specified, decorators with groups now are being ignored
* changed signature of the `ValidationError`. Now if it has nested errors it does not return them in a flat array

**0.3.0**

* package has changed its name from `validator.ts` to `class-validator`.
* sanitation functionality has been removed from this library. Use [class-sanitizer][1] instead.

[1]: https://github.com/pleerock/class-sanitizer