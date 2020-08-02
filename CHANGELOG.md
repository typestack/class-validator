## [0.12.2](https://github.com/typestack/class-validator/compare/v0.12.1...v0.12.2) (2020-04-23)

### Bug Fixes

- move `tslib` from `peerDependencies` to `dependencies` ([827eff1](https://github.com/typestack/class-validator/commit/827eff1)), closes [#588](https://github.com/typestack/class-validator/issues/588)

## [0.12.1](https://github.com/typestack/class-validator/compare/v0.12.0...v0.12.1) (2020-04-18)

### Bug Fixes

- apply only nested validator for ValidateNested multi-dimensional array ([c463be5](https://github.com/typestack/class-validator/commit/c463be5))

# [0.12.0](https://github.com/typestack/class-validator/compare/v0.11.1...v0.12.0) (2020-04-18)

### Bug Fixes

- accept negative timezone in isDateString ([#564](https://github.com/typestack/class-validator/issues/564)) ([2012d72](https://github.com/typestack/class-validator/commit/2012d72)), closes [#565](https://github.com/typestack/class-validator/issues/565)
- apply all decorators type PropertyDecorator ([#556](https://github.com/typestack/class-validator/issues/556)) ([5fb36e3](https://github.com/typestack/class-validator/commit/5fb36e3)), closes [#555](https://github.com/typestack/class-validator/issues/555)
- avoiding metadataStorage from DI ([#335](https://github.com/typestack/class-validator/issues/335)) ([b57fef4](https://github.com/typestack/class-validator/commit/b57fef4)), closes [#328](https://github.com/typestack/class-validator/issues/328) [#261](https://github.com/typestack/class-validator/issues/261) [#132](https://github.com/typestack/class-validator/issues/132)
- correct registerDecorator options argument ([7909ec6](https://github.com/typestack/class-validator/commit/7909ec6)), closes [#302](https://github.com/typestack/class-validator/issues/302)
- IsNumberString accept isNumbericOptions as argument ([62b993f](https://github.com/typestack/class-validator/commit/62b993f)), closes [#518](https://github.com/typestack/class-validator/issues/518) [#463](https://github.com/typestack/class-validator/issues/463)
- optional `constraints` property in ValidationError ([#465](https://github.com/typestack/class-validator/issues/465)) ([84680ad](https://github.com/typestack/class-validator/commit/84680ad)), closes [#309](https://github.com/typestack/class-validator/issues/309)
- pass context to ValidationError for async validations ([#533](https://github.com/typestack/class-validator/issues/533)) ([4eb1216](https://github.com/typestack/class-validator/commit/4eb1216))
- switch isLatitude & isLongitude validators ([#513](https://github.com/typestack/class-validator/issues/513)) ([5497179](https://github.com/typestack/class-validator/commit/5497179)), closes [#502](https://github.com/typestack/class-validator/issues/502)
- switch isLatitude & isLongitude validators ([#537](https://github.com/typestack/class-validator/issues/537)) ([c27500b](https://github.com/typestack/class-validator/commit/c27500b))
- ValidateNested support multi-dimensional arrays ([#539](https://github.com/typestack/class-validator/issues/539)) ([62678e1](https://github.com/typestack/class-validator/commit/62678e1))

### Code Refactoring

- update build process to enable tree shaking ([#568](https://github.com/typestack/class-validator/issues/568)) ([11a7b8b](https://github.com/typestack/class-validator/commit/11a7b8b)), closes [#258](https://github.com/typestack/class-validator/issues/258) [#248](https://github.com/typestack/class-validator/issues/248) [#247](https://github.com/typestack/class-validator/issues/247) [#212](https://github.com/typestack/class-validator/issues/212)

### Features

- sync validatorjs version from v10.11.3 to v13.0.0 ([09120b7](https://github.com/typestack/class-validator/commit/09120b7)), closes [#576](https://github.com/typestack/class-validator/issues/576) [#425](https://github.com/typestack/class-validator/issues/425)

### BREAKING CHANGES

- Validatorjs releases contain some breaking changes e.g. `IsMobileNumber` or `IsHexColor`. Please check validatorjs [CHANGELOG](https://github.com/validatorjs/validator.js/blob/master/CHANGELOG.md)
- Validation functions was removed from `Validator` class to enable tree shaking.

  BEFORE:

  ```ts
  import { Validator } from 'class-validator';

  const validator = new Validator();
  validator.isNotIn(value, possibleValues);
  validator.isBoolean(value);
  ```

  AFTER:

  ```ts
  import { isNotIn, isBoolean } from 'class-validator';

  isNotIn(value, possibleValues);
  isBoolean(value);
  ```

- IsNumberString decorator arguments changed to `@IsNumberString(ValidatorJS.IsNumericOptions, ValidationOptions)`.

## [0.11.1](https://github.com/typestack/class-validator/compare/v0.11.0...v0.11.1) (2020-03-18)

### Bug Fixes

- IsNumber validator now works when maxDecimalPlaces=0 ([#524](https://github.com/typestack/class-validator/issues/524)) ([b8aa922](https://github.com/typestack/class-validator/commit/b8aa922))

### Features

- add all option in isuuid validator ([#452](https://github.com/typestack/class-validator/issues/452)) ([98e9382](https://github.com/typestack/class-validator/commit/98e9382))
- add IsFirebasePushId validator ([#548](https://github.com/typestack/class-validator/issues/548)) ([e7e2e53](https://github.com/typestack/class-validator/commit/e7e2e53))
- add options for isISO8601 validator ([#460](https://github.com/typestack/class-validator/issues/460)) ([90a6638](https://github.com/typestack/class-validator/commit/90a6638))

# [0.11.0](https://github.com/typestack/class-validator/compare/v0.10.2...v0.11.0) (2019-11-01)

### Bug Fixes

- create instance of ValidationError for whitelist errors ([#434](https://github.com/typestack/class-validator/issues/434)) ([a98f5dd](https://github.com/typestack/class-validator/commit/a98f5dd)), closes [#325](https://github.com/typestack/class-validator/issues/325)
- pass context for isDefined and custom validators ([#296](https://github.com/typestack/class-validator/issues/296)) ([0ef898e](https://github.com/typestack/class-validator/commit/0ef898e)), closes [#292](https://github.com/typestack/class-validator/issues/292)

### Features

- add isHash validator ([#445](https://github.com/typestack/class-validator/issues/445)) ([c454cf9](https://github.com/typestack/class-validator/commit/c454cf9))
- add isISSN validator ([#450](https://github.com/typestack/class-validator/issues/450)) ([4bd586e](https://github.com/typestack/class-validator/commit/4bd586e))
- add isJWT validator ([#444](https://github.com/typestack/class-validator/issues/444)) ([874861b](https://github.com/typestack/class-validator/commit/874861b))
- add isMACAddress validator ([#449](https://github.com/typestack/class-validator/issues/449)) ([45b7df7](https://github.com/typestack/class-validator/commit/45b7df7))
- add support for maxDecimalPlaces on IsNumber ([#381](https://github.com/typestack/class-validator/issues/381)) ([a4dc10e](https://github.com/typestack/class-validator/commit/a4dc10e))

### BREAKING CHANGES

- update @types/validator from 11.1.0 to version 12.0.0 - please check it's [changelog][validator-js-release-notes]

## [0.10.2](https://github.com/typestack/class-validator/compare/v0.10.1...v0.10.2) (2019-10-14)

### Bug Fixes

- apply custom constraint class validation to each item in the array ([#295](https://github.com/typestack/class-validator/issues/295)) ([5bb704e](https://github.com/typestack/class-validator/commit/5bb704e)), closes [#260](https://github.com/typestack/class-validator/issues/260)

### Features

- add isLatLong, isLatitude, isLongtitude validators ([#427](https://github.com/typestack/class-validator/issues/427)) ([3fd15c4](https://github.com/typestack/class-validator/commit/3fd15c4)), closes [#415](https://github.com/typestack/class-validator/issues/415)
- add IsObject and IsNotEmptyObject new decorators ([#334](https://github.com/typestack/class-validator/issues/334)) ([0a41aeb](https://github.com/typestack/class-validator/commit/0a41aeb))
- support ES6 Map and Set for regular validators with each option ([#430](https://github.com/typestack/class-validator/issues/430)) ([a055bba](https://github.com/typestack/class-validator/commit/a055bba)), closes [#428](https://github.com/typestack/class-validator/issues/428)

## [0.10.1](https://github.com/typestack/class-validator/compare/v0.10.0...v0.10.1) (2019-09-25)

### Bug Fixes

- add default message for isMilitaryTime validator ([#411](https://github.com/typestack/class-validator/issues/411)) ([204b7df](https://github.com/typestack/class-validator/commit/204b7df)), closes [#287](https://github.com/typestack/class-validator/issues/287)
- add default message for isPort validator ([#404](https://github.com/typestack/class-validator/issues/404)) ([74e568c](https://github.com/typestack/class-validator/commit/74e568c))
- add locale parameter for isAlpha and isAlphanumeric validat… ([#406](https://github.com/typestack/class-validator/issues/406)) ([2f4bf4e](https://github.com/typestack/class-validator/commit/2f4bf4e))

### Features

- add `skipUndefinedProperties`, `skipNullProperties` options ([#414](https://github.com/typestack/class-validator/issues/414)) ([76c948a](https://github.com/typestack/class-validator/commit/76c948a)), closes [#308](https://github.com/typestack/class-validator/issues/308)

# [0.10.0](https://github.com/typestack/class-validator/compare/v0.9.1...v0.10.0) (2019-08-10)

### Bug Fixes

- add correct signature for custom error message handler ([249c41d](https://github.com/typestack/class-validator/commit/249c41d))

### Features

- add `IsISO31661Alpha3` and `IsISO31661Alpha2` validators ([#273](https://github.com/typestack/class-validator/issues/273)) ([55c57b3](https://github.com/typestack/class-validator/commit/55c57b3))
- **IsDecimal:** implement `IsDecimal` from validatorjs ([#359](https://github.com/typestack/class-validator/issues/359)) ([b4c8e21](https://github.com/typestack/class-validator/commit/b4c8e21))
- add `isPort` decorator ([#282](https://github.com/typestack/class-validator/issues/282)) ([36684ec](https://github.com/typestack/class-validator/commit/36684ec))
- allow validate Map/Set ([#365](https://github.com/typestack/class-validator/issues/365)) ([f6fcdc5](https://github.com/typestack/class-validator/commit/f6fcdc5))
- new `ValidatePromise` decorator - resolve promise before validate ([#369](https://github.com/typestack/class-validator/issues/369)) ([35ec04d](https://github.com/typestack/class-validator/commit/35ec04d))
- replace instanceof Promise and support Promise/A+ ([#310](https://github.com/typestack/class-validator/issues/310)) ([59eac09](https://github.com/typestack/class-validator/commit/59eac09))
- `isNumberString` now accept validator.js `IsNumericOptions` as second parameter ([#262](https://github.com/typestack/class-validator/issues/262))

### BREAKING CHANGES

- update @types/validator from 10.4.0 to version 10.11.2 - please check it's [changelog][validator-js-release-notes] ([cb960dd](https://github.com/typestack/class-validator/commit/cb960dd))
- `isDateString` now check to match only entire ISO Date ([#275](https://github.com/typestack/class-validator/issues/275)) ([5012464](https://github.com/typestack/class-validator/commit/5012464))
- remove `IsCurrencyOptions`, `IsURLOptions`, `IsEmailOptions`, `IsFQDNOptions` interfaces and replace with interfaces from `@types/validator`

## [0.9.1](https://github.com/typestack/class-validator/compare/v0.9.0...v0.9.1)

### Features

- added option to pass custom context for the decorators

### Bug Fixes

- validating against a schema will validate against that one instead of every registered one

# [0.9.0](https://github.com/typestack/class-validator/compare/v0.8.5...v0.9.0) [BREAKING CHANGE]

### Features

- updated [validator.js][validator-js] from 9.2.0 to 10.4.0 (Check it's [changelog][validator-js-release-notes] for what has changed.)
  - until now fractional numbers was not allowed in the `IsNumberString` decorator, now they are allowed
  - until now Gmail addresses could contain multiple dots or random text after a `+` symbol, this is not allowed anymore
- `IsPhoneNumber` decorator has been added which uses the [google-libphonenumber][google-libphonenumber] library to validate international phone numbers accurately

### Bug Fixes

- update `IsURLOptions` to match underlying validator host list options
- added a console warning when no metadata decorator is found as it's possibly not intended
- the `Min` and `Max` decorator will corectly show an inclusive error message when failing
- fixed a runtime error when `validationArguments.value` is not a string

## [0.8.5](https://github.com/typestack/class-validator/compare/v0.8.4...v0.8.5)

### Bug Fixes

- remove `ansicolor` package, because it's incompatible with IE

## [0.8.4](https://github.com/typestack/class-validator/compare/v0.8.3...v0.8.4)

### Features

- `ValidatorOptions` now has a `forbidUnknownValues` key to prevent unknown objects to pass validation
  - it's highly advised to turn this option on
  - now this option defaults to `false` but will be default to `true` after the **1.0** release

## [0.8.3](https://github.com/typestack/class-validator/compare/v0.8.2...v0.8.3)

### Bug Fixes

- handle when `target` property is undefined when calling `ValidationError.toString()`

## [0.8.2](https://github.com/typestack/class-validator/compare/v0.8.1...v0.8.2)

### Features

- added `ValidationError.toString()` method for easier debugging
- added `printError` method to pretty-print errors in NodeJS or the browser

### Bug Fixes

- fixed wrong type info in `ValidatorOptions`
- fixed wrong type info in `ValidationSchema` \(the `options` key now is optional\)
- corrected `IsNumericString` to `IsNumberString` in the README
- fixed type of `host_whitelist` and `host_backlist` in `IsURLOptions`

## [0.8.1](https://github.com/typestack/class-validator/compare/v0.8.0...v0.8.1)

### Bug Fixes

- fixed wrong type info in `ValidatorOptions`

# 0.8.0 \[BREAKING CHANGE\]

### Features

- updated [validator.js][validator-js] from 7.0.0 to 9.2.0 (Check it's [changelog][validator-js-release-notes] for what has changed.)

  This caused breaking change, if you used the `IsUrl` decorator to validate `localhost` as a valid url, from now you must use the `require_tld: false` option

  ```typescript
  @IsUrl({ require_tld: false})
  url: string;
  ```

- added `@IsInstance` decorator and `validator.isInstance(value, target)` method.
- changed `@IsNumber` decorator has been changed to `@IsNumber(options: IsNumberOptions)`
- added option to strip unknown properties \(`whitelist: true`\)
- added option to throw error on unknown properties \(`forbidNonWhitelisted: true`\)
- added `@Allow` decorator to prevent stripping properties without other constraint

### Bug Fixes

- fixed issue with `@IsDateString` now it allow dates without fraction seconds to be set
- fixed issue with `@IsDateString` now it allow dates without with timezones to be set
- `@ValidateNested` correctly generates validation error on non object and non array values

## 0.6.7

### Bug Fixes

- fixed issue with `@ValidateNested` when nested property is not defined and it throw an error \(\#59\)

## 0.6.5

### Bug Fixes

- fixed bugs with `@IsUrl`, `@IsEmail` and several other decorators

## 0.6.4

### Features

- added `@IsMilitaryTime` decorator.

## 0.6.3

### Features

- added `validateOrReject` method which rejects promise instead of returning array of errors in resolved result

## 0.6.1

### Features

- added `@IsArray` decorator.

# 0.6.0 \[BREAKING CHANGE\]

### Features

- breaking change with `@ValidateNested` on arrays: Validator now groups the validation errors by sub-object, rather than them all being grouped together. See \#32 for a demonstration of the updated structure.
- added `@ValidateIf` decorator, see conditional validation in docs.

# 0.5.0 \[BREAKING CHANGE\]

### Features

- async validations must be marked with `{ async: true }` option now.

  This is optional, but it helps to determine which decorators are async to prevent their execution in `validateSync` method.

- added `validateSync` method that performs non asynchronous validation and ignores validations that marked with `async: true`.
- there is a breaking change in `registerDecorator` method. Now it accepts options object.
- breaking change with `@ValidatorConstraint` decorator. Now it accepts option object instead of single name.

## 0.4.1

### Bug Fixes

- fixed issue with wrong source maps packaged

# 0.4.0 \[BREAKING CHANGE\]

### Features

- everything should be imported from "class-validator" main entry point now
- `ValidatorInterface` has been renamed to `ValidatorConstraintInterface`
- contain can be set in the main entry point now
- some decorator's names changed. Be aware of this
- added few more non-string decorators
- validator now returns array of ValidationError instead of ValidationErrorInterface. Removed old ValidationError
- removed all other validation methods except `validator.validate`
- finally validate method is async now, so custom async validations are supported now
- added ability to validate inherited properties
- added support of separate validation schemas
- added support of default validation messages
- added support of special tokens in validation messages
- added support of message functions in validation options
- added support of custom decorators
- if no groups were specified, decorators with groups now are being ignored
- changed signature of the `ValidationError`. Now if it has nested errors it does not return them in a flat array

### Bug Fixes

- fixed all decorators that should not work only with strings

# 0.3.0

### Features

- package has changed its name from `validator.ts` to `class-validator`.
- sanitation functionality has been removed from this library. Use [class-sanitizer][1] instead.

[1]: https://github.com/typestack/class-validator/class-sanitizer
[validator-js]: https://github.com/chriso/validator.js
[validator-js-release-notes]: https://github.com/chriso/validator.js/blob/master/CHANGELOG.md
[google-libphonenumber]: https://github.com/ruimarinho/google-libphonenumber
