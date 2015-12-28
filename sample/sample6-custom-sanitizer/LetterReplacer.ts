import {SanitizerConstraint} from "../../src/decorator/Sanitization";
import {SanitizerInterface} from "../../src/SanitizerInterface";

@SanitizerConstraint()
export class LetterReplacer implements SanitizerInterface {

    sanitize(text: string): string {
        return text.replace(/o/g, "w");
    }

}