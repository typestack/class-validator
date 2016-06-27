import {CustomValidator} from "../../src/validation/CustomValidator";
import {ValidatorConstraint} from "../../src/decorator/decorators";

@ValidatorConstraint()
export class CustomTextLength implements CustomValidator {

    validate(text: string): Promise<boolean>|boolean {
        return Promise.resolve(text.length > 1 && text.length < 10);
    }

}