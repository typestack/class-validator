import { ValidationArguments } from '../validation/ValidationArguments';

/**
 * Options used to pass to validation decorators.
 */
export interface ValidationOptions {
  /**
   * Indicates that an object is to be considered object literal record.
   *
   * For an object-valued property marked as object literal, the object the property holds may neither
   * be specifically class-typed nor validated, but all the child values of said object MUST be.
   * Effectively, this declares object literal, which will be validated the same way any other
   * JavaScript collection does (Array, Map, Set, etc).
   * The default is `false`; that is, an object-value must be an instance of a class.
   */
  objectLiteral?: boolean;

  /**
   * Specifies if validated value is an array and each of its items must be validated.
   */
  each?: boolean;

  /**
   * Error message to be used on validation fail.
   * Message can be either string or a function that returns a string.
   */
  message?: string | ((validationArguments: ValidationArguments) => string);

  /**
   * Validation groups used for this validation.
   */
  groups?: string[];

  /**
   * Indicates if validation must be performed always, no matter of validation groups used.
   */
  always?: boolean;

  /*
   * A transient set of data passed through to the validation result for response mapping
   */
  context?: any;
}

export function isValidationOptions(val: any): val is ValidationOptions {
  if (!val) {
    return false;
  }
  return (
    'objectLiteral' in val ||
    'each' in val ||
    'message' in val ||
    'groups' in val ||
    'always' in val ||
    'context' in val
  );
}
