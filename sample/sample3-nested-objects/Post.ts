import {ValidateNested} from "../../src/decorator/decorators";
import {Tag} from "./Tag";
import {Length} from "../../src/decorator/Length";

export class Post {

    @Length(10, 20, {
        message: "Incorrect length!"
    })
    title: string;

    @ValidateNested()
    tags: Tag[];

}
