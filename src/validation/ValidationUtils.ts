import { ValidationArguments } from './ValidationArguments';

/**
 * Convert the constraint to a string to be shown in an error
 */
export function constraintToString(constraint: unknown): string {
  if (typeof constraint === 'string') return constraint;

  // join array as <comma><space> separated values strings
  if (Array.isArray(constraint)) return constraint.map(constraintToString).join(', ');

  // convert to string...
  return String(constraint);
}

export class ValidationUtils {
  static replaceMessageSpecialTokens(
    message: string | ((args: ValidationArguments) => string),
    validationArguments: ValidationArguments
  ): string {
    let messageString: string;
    if (message instanceof Function) {
      messageString = (message as (args: ValidationArguments) => string)(validationArguments);
    } else if (typeof message === 'string') {
      messageString = message;
    }

    if (messageString && validationArguments.constraints instanceof Array) {
      validationArguments.constraints.forEach((constraint, index) => {
        messageString = messageString.replace(new RegExp(`\\$constraint${index + 1}`, 'g'), constraintToString(constraint));
      });
    }

    if (
      messageString &&
      validationArguments.value !== undefined &&
      validationArguments.value !== null &&
      typeof validationArguments.value === 'string'
    )
      messageString = messageString.replace(/\$value/g, validationArguments.value);
    if (messageString) messageString = messageString.replace(/\$property/g, validationArguments.property);
    if (messageString) messageString = messageString.replace(/\$target/g, validationArguments.targetName);

    return messageString;
  }
}
