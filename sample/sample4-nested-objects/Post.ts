import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate, ValidateNested} from "../../src/decorator/Validation";
import {Tag} from "./Tag";

export class Post {

    @IsLength(10, 20, {
        message: "Incorrect length!"
    })
    title: string;

    @ValidateNested()
    tags: Tag[];

}