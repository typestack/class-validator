import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isMongoIdValidator from 'validator/es/lib/isMongoId';

export const IS_MONGO_ID = 'isMongoId';

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 * If given value is not a string, then it returns false.
 */
export function isMongoId(value: unknown): boolean {
  return typeof value === 'string' && isMongoIdValidator(value);
}

/**
 * Checks if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 * If given value is not a string, then it returns false.
 */
export function IsMongoId(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_MONGO_ID,
      validator: {
        validate: (value, args): boolean => isMongoId(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a mongodb id', validationOptions),
      },
    },
    validationOptions
  );
}
