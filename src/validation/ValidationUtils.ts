import { getClassValidatorPropertyTitle, getClassValidatorTitle } from '../multi-lang';
import { ValidationArguments } from './ValidationArguments';

/**
 * Convert the constraint to a string to be shown in an error
 */
export function constraintToString(constraint: unknown): string {
  if (Array.isArray(constraint)) {
    return constraint.join(', ');
  }

  return `${constraint}`;
}

export class ValidationUtils {
  static replaceMessageSpecialTokens(
    message: string | ((args: ValidationArguments) => string),
    validationArguments: ValidationArguments,
    titles: { [key: string]: string }
  ): string {
    const checkTitle = Object.keys(titles).length > 0;
    let messageString: string = '';
    if (message instanceof Function) {
      messageString = (message as (args: ValidationArguments) => string)(validationArguments);
    } else if (typeof message === 'string') {
      messageString = message;
    }

    if (messageString && validationArguments.constraints instanceof Array) {
      validationArguments.constraints.forEach((constraint, index) => {
        messageString = messageString.replace(
          new RegExp(`\\$constraint${index + 1}`, 'g'),
          (checkTitle &&
            titles[
              getClassValidatorTitle(validationArguments.object, constraintToString(constraint)) ||
                constraintToString(constraint)
            ]) ||
            constraintToString(constraint)
        );
      });
    }

    if (
      messageString &&
      validationArguments.value !== undefined &&
      validationArguments.value !== null &&
      typeof validationArguments.value === 'string'
    )
      messageString = messageString.replace(
        /\$value/g,
        (checkTitle &&
          titles[
            getClassValidatorTitle(validationArguments.object, validationArguments.value) || validationArguments.value
          ]) ||
          validationArguments.value
      );
    if (messageString) {
      messageString = messageString.replace(
        /\$property/g,
        (checkTitle &&
          titles[
            getClassValidatorPropertyTitle(validationArguments.object, validationArguments.property) ||
              validationArguments.property
          ]) ||
          validationArguments.property
      );
    }
    if (messageString) {
      messageString = messageString.replace(
        /\$target/g,
        (checkTitle &&
          titles[getClassValidatorTitle(validationArguments.object, '') || validationArguments.targetName]) ||
          validationArguments.targetName
      );
    }

    return messageString;
  }
}
