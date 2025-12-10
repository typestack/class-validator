import { ValidationOptions } from '../ValidationOptions';
import { ValidateBy, buildMessage } from './ValidateBy';

export const DOES_MATCH = 'doesMatch';

/**
 * Checks if a given value follows a custom condition.
 */
export function DoesMatch(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy({
    name: DOES_MATCH,
    validator: {
      validate: (value, args): boolean => condition(args?.object, value),
      defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property does not match', validationOptions),
    },
  });
}
