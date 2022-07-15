/**
 * Options passed to validator during validation.
 */
export interface ValidatorOptions {
  /**
   * If set to true then class-validator will print extra warning messages to the console when something is not right.
   */
  enableDebugMessages?: boolean;

  /**
   * If set to true then validator will skip validation of all properties that are undefined in the validating object.
   */
  skipUndefinedProperties?: boolean;

  /**
   * If set to true then validator will skip validation of all properties that are null in the validating object.
   */
  skipNullProperties?: boolean;

  /**
   * If set to true then validator will skip validation of all properties that are null or undefined in the validating object.
   */
  skipMissingProperties?: boolean;

  /**
   * If set to true validator will strip validated object of any properties that do not have any decorators.
   *
   * Tip: if no other decorator is suitable for your property use @Allow decorator.
   */
  whitelist?: boolean;

  /**
   * If set to true, instead of stripping non-whitelisted properties validator will throw an error
   */
  forbidNonWhitelisted?: boolean;

  /**
   * Groups to be used during validation of the object.
   */
  groups?: string[];

  /**
   * Set default for `always` option of decorators. Default can be overridden in decorator options.
   */
  always?: boolean;

  /**
   * If [groups]{@link ValidatorOptions#groups} is not given or is empty,
   * ignore decorators with at least one group.
   */
  strictGroups?: boolean;

  /**
   * If set to true, the validation will not use default messages.
   * Error message always will be undefined if its not explicitly set.
   */
  dismissDefaultMessages?: boolean;

  /**
   * If set to true, the validation error message will return only the args of the validation decorator.
   * Together with the validation type name and the validation arguments, users' standard custom error messages can be composed without any requirement for placing a custom message for each decorator.
   * This mode also helps constructing localized error messages together with a supporting i18n library.
   * Default messages and explicitly set messages will have no effect in this mode.   */
  externalMessageComposer?: boolean;

  /**
   * ValidationError special options.
   */
  validationError?: {
    /**
     * Indicates if target should be exposed in ValidationError.
     */
    target?: boolean;

    /**
     * Indicates if validated value should be exposed in ValidationError.
     */
    value?: boolean;
  };

  /**
   * Settings true will cause fail validation of unknown objects.
   */
  forbidUnknownValues?: boolean;

  /**
   * When set to true, validation of the given property will stop after encountering the first error. Defaults to false.
   */
  stopAtFirstError?: boolean;
}
