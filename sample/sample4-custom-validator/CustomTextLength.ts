import {CustomValidator} from "../../src/validation/CustomValidator";
import {ValidatorConstraint} from "../../src/decorator/decorators";

@ValidatorConstraint()
export class CustomTextLength implements CustomValidator {

    validate(text: string) {
        return text.length > 1 && text.length < 10;
    }

}