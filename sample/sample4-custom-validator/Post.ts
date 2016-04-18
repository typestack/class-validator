import {Contains, IsInt, MinLength, MaxLength, IsEmail, IsFQDN, IsDate, NotEmpty, NotEmptyArray, MinSize, MaxSize} from "../../src/decorators";
import {Validate} from "../../src/decorators";
import {CustomTextLength} from "./CustomTextLength";

export class Post {

    @Validate(CustomTextLength, {
        message: "Wrong post title"
    })
    title: string;

}