import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isHashValidator from 'validator/es/lib/isHash';
import ValidatorJS from 'validator';

export const IS_HASH = 'isHash';

/**
 * Check if the string is a hash of type algorithm.
 * Algorithm is one of ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
 * 'tiger160', 'tiger192', 'crc32', 'crc32b']
 */
export function isHash(value: unknown, algorithm: ValidatorJS.HashAlgorithm): boolean {
  return typeof value === 'string' && isHashValidator(value, algorithm);
}

/**
 * Check if the string is a hash of type algorithm.
 * Algorithm is one of ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
 * 'tiger160', 'tiger192', 'crc32', 'crc32b']
 */
export function IsHash(algorithm: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_HASH,
      constraints: [algorithm],
      validator: {
        validate: (value, args): boolean => isHash(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a hash of type $constraint1',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
