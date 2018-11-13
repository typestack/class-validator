import {Length, IsEmail, IsFQDN} from "../../src/decorator/decorators";
import {IsDate} from "../../src/decorator/IsDate";
import {IsInt} from "../../src/decorator/IsInt";
import {Contains} from "../../src/decorator/Contains";

export class Post {

    @Length(10, 20, {
        message: "Incorrect length!",
        groups: ["users", "moderators"]
    })
    @Length(0, 20, {
        message: "Incorrect length!",
        groups: ["admins"]
    })
    title: string;

    @Contains("hello", {
        message: "It should contain word \"hello!\"",
        groups: ["users", "moderators"]
    })
    text: string;

    @IsInt()
    rating: number;

    @IsEmail(undefined, {
        always: true
    })
    email: string;

    @IsFQDN(undefined, {
        message: "Site address should be correct",
        groups: ["users"]
    })
    site: string;

    @IsDate()
    createDate: Date;

}
