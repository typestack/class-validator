import {BaseContent} from "./BaseContent";
import {IsInt} from "../../src/decorator/IsInt";
import {Contains} from "../../src/decorator/Contains";
import {MinLength} from "../../src/decorator/MinLength";
import {MaxLength} from "../../src/decorator/MaxLength";

export class Post extends BaseContent {

    @MinLength(10)
    @MaxLength(20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt()
    rating: number;

}
