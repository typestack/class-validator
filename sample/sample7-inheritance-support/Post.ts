import {Contains, MinLength, MaxLength} from "../../src/decorator/decorators";
import {BaseContent} from "./BaseContent";
import {IsInt} from "../../src/decorator/IsInt";

export class Post extends BaseContent {

    @MinLength(10)
    @MaxLength(20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt()
    rating: number;

}
