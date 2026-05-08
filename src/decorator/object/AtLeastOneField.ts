import { getMetadataStorage } from '../../metadata/MetadataStorage';
import { registerDecorator } from '../../register-decorator';
import { ValidationArguments } from '../../validation/ValidationArguments';
import { ValidatorConstraintInterface } from '../../validation/ValidatorConstraintInterface';
import { ValidationOptions } from '../ValidationOptions';
import { ValidatorConstraint } from '../common/Validate';

const hasValue = (value: unknown): boolean => value !== undefined && value !== null && value !== '';

const getClassFields = (target: Function): string[] => {
  const storage = getMetadataStorage();

  const metadata = storage.getTargetValidationMetadatas(target, '', false, false);

  return [
    ...new Set(
      metadata.map(m => m.propertyName).filter(field => field !== '' && field !== null && field !== undefined)
    ),
  ];
};

// ─────────────────────────────────────────────
//  Constraint
// ─────────────────────────────────────────────

@ValidatorConstraint({ name: 'AtLeastOneField', async: false })
export class AtLeastOneFieldConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, { object }: ValidationArguments): boolean {
    return Object.values(object as Record<string, unknown>).some(hasValue);
  }

  defaultMessage({ object }: ValidationArguments): string {
    const fields = getClassFields(object.constructor as Function);
    return `At least one of the following fields must be provided: [${fields.join(', ')}]`;
  }
}

// ─────────────────────────────────────────────
//  Decorator
// ─────────────────────────────────────────────

export function AtLeastOneField(validationOptions?: ValidationOptions) {
  return (target: Function) => {
    registerDecorator({
      target,
      propertyName: '',
      options: validationOptions,
      validator: AtLeastOneFieldConstraint,
    });
  };
}
