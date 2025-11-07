import { ValidationOptions } from '../decorator/ValidationOptions';

/**
 * Constructor arguments for ValidationMetadata class.
 */
export interface ValidationMetadataArgs {
  /**
   * Validation type. Should be one of the ValidationTypes values.
   */
  type: string;

  /**
   * Validation name. Used to uniquely identify this validator.
   */
  name: string;

  /**
   * Object that is used to be validated.
   */
  target: Function | string;

  /**
   * Property of the object to be validated.
   */
  propertyName: string;

  /**
   * Constraint class that performs validation. Used only for custom validations.
   */
  constraintCls?: Function;

  /**
   * Array of constraints of this validation.
   */
  constraints?: any[];

  /**
   * Validation options.
   */
  validationOptions?: ValidationOptions;

  /**
   * Extra options specific to validation type.
   */
  validationTypeOptions?: any;
}
