import { ValidationArguments } from './ValidationArguments';

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
        messageString = messageString.replace(new RegExp(`\\$constraint${index + 1}`, 'g'), constraint);
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
