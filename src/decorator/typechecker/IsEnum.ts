import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_ENUM = 'isEnum';

/**
 * Checks if a given value is the member of the provided enum.
 */
export function isEnum(value: unknown, entity: any): boolean {
  const enumValues = Object.values(entity);
  return enumValues.includes(value);
}

/**
 * Returns the possible values from an enum (both simple number indexed and string indexed enums).
 */
function validEnumValues(entity: any): string[] {
  return Object.entries(entity)
    .filter(([key, value]) => isNaN(parseInt(key)))
    .map(([key, value]) => value as string);
}

/**
 * Checks if a given value is the member of the provided enum.
 */
export function IsEnum(entity: object, validationOptions?: ValidationOptions): PropertyDecorator {
  const enumValuesSet = new Set(Object.values(entity));
  return ValidateBy(
    {
      name: IS_ENUM,
      constraints: [entity, validEnumValues(entity)],
      validator: {
        validate: (value): boolean => enumValuesSet.has(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be one of the following values: $constraint2',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
