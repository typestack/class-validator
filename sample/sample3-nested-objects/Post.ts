import {Tag} from "./Tag";
import {Length} from "../../src/decorator/string/Length";
import {ValidateNested} from "../../src/decorator/system/ValidateNested";

export class Post {

    @Length(10, 20, {
        message: "Incorrect length!"
    })
    title: string;

    @ValidateNested()
    tags: Tag[];

}
