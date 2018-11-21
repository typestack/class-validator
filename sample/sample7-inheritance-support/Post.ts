import {BaseContent} from "./BaseContent";
import {IsInt} from "../../src/decorator/typechecker/IsInt";
import {Contains} from "../../src/decorator/string/Contains";
import {MinLength} from "../../src/decorator/string/MinLength";
import {MaxLength} from "../../src/decorator/string/MaxLength";

export class Post extends BaseContent {

    @MinLength(10)
    @MaxLength(20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt()
    rating: number;

}
