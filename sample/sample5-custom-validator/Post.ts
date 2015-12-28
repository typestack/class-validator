import {Contains, IsInt, MinLength, MaxLength, IsEmail, IsFQDN, IsDate, NotEmpty, NotEmptyArray, MinSize, MaxSize} from "../../src/decorator/Validation";
import {Validate} from "../../src/decorator/Validation";
import {CustomTextLength} from "./CustomTextLength";

export class Post {

    @Validate(CustomTextLength, {
        message: "Wrong post title"
    })
    title: string;

}