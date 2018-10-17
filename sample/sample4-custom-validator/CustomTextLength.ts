import {ValidatorConstraint} from "../../src/decorator/ValidatorConstraint";
import {ValidatorConstraintInterface} from "../../src/validation/ValidatorConstraintInterface";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string) {
        return text.length > 1 && text.length < 10;
    }

}
