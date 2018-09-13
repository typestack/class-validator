import {CustomTextLength} from "./CustomTextLength";
import {Validate} from "../../src/decorator/Validate";

export class Post {

    @Validate(CustomTextLength, {
        message: "Wrong post title"
    })
    title: string;

}
