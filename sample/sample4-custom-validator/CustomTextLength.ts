import {ValidatorConstraintInterface} from "../../src/validation/ValidatorConstraintInterface";
import {ValidatorConstraint} from "../../src/decorator/ValidatorConstraint";

@ValidatorConstraint()
export class CustomTextLength implements ValidatorConstraintInterface {

    validate(text: string) {
        return text.length > 1 && text.length < 10;
    }

}
