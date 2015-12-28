import {Contains, IsInt, MinLength, MaxLength, IsEmail, IsFQDN, IsDate, NotEmpty, NotEmptyArray, MinSize, MaxSize} from "../../src/decorator/Validation";
import {Sanitize} from "../../src/decorator/Sanitization";
import {LetterReplacer} from "./LetterReplacer";

export class Post {

    @Sanitize(LetterReplacer)
    title: string;

}