import { ValidatorConstraintInterface } from '../../src/validation/ValidatorConstraintInterface';
import { ValidatorConstraint } from '../../src/decorator/decorators';

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string) {
    return text.length > 1 && text.length < 10;
  }
}
