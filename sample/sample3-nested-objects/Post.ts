import {IsContain, IsInt, IsLength, IsEmail, IsFQDN, IsDate, NestedValidation} from "../../src/decorator/decorators";
import {Tag} from "./Tag";

export class Post {

    @IsLength(10, 20, {
        message: "Incorrect length!"
    })
    title: string;

    @NestedValidation()
    tags: Tag[];

}