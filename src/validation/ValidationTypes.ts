/**
 * Validation types.
 */
export class ValidationTypes {
  /* system */
  static CUSTOM_VALIDATION = 'customValidation'; // done
  static NESTED_VALIDATION = 'nestedValidation'; // done
  static PROMISE_VALIDATION = 'promiseValidation'; // done
  static CONDITIONAL_VALIDATION = 'conditionalValidation'; // done
  static WHITELIST = 'whitelistValidation'; // done
  static IS_DEFINED = 'isDefined'; // done

  /**
   * Checks if validation type is valid.
   */
  static isValid(type: string): boolean {
    return (
      type !== 'isValid' &&
      type !== 'getMessage' &&
      Object.keys(this)
        .map(key => (this as any)[key])
        .indexOf(type) !== -1
    );
  }
}
