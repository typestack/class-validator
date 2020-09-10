import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import { getText } from '../../multi-lang';

export const IS_INSTANCE = 'isInstance';

/**
 * Checks if the value is an instance of the specified object.
 */
export function isInstance(object: unknown, targetTypeConstructor: new (...args: any[]) => any): boolean {
  return (
    targetTypeConstructor && typeof targetTypeConstructor === 'function' && object instanceof targetTypeConstructor
  );
}

/**
 * Checks if the value is an instance of the specified object.
 */
export function IsInstance(
  targetType: new (...args: any[]) => any,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_INSTANCE,
      constraints: [targetType],
      validator: {
        validate: (value, args): boolean => isInstance(value, args.constraints[0]),
        defaultMessage: buildMessage((eachPrefix, args) => {
          if (args.constraints[0]) {
            return (
              eachPrefix +
              getText(`$property must be an instance of $constraint1name`).replace(
                '$constraint1name',
                (args && args.constraints && args.constraints[0].name) as string
              )
            );
          } else {
            return (
              eachPrefix +
              getText(`$IS_INSTANCE decorator expects and object as value, but got falsy value.`).replace(
                '$IS_INSTANCE',
                IS_INSTANCE
              )
            );
          }
        }, validationOptions),
      },
    },
    validationOptions
  );
}
