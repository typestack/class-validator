import {IsContain, IsInt, IsMinLength, IsMaxLength, IsEmail, IsFQDN, IsDate, IsNotEmpty, IsNotEmptyArray, IsMinSize, IsMaxSize} from "../../src/decorators";
import {Validate} from "../../src/decorators";
import {CustomTextLength} from "./CustomTextLength";

export class Post {

    @Validate(CustomTextLength, {
        message: "Wrong post title"
    })
    title: string;

}