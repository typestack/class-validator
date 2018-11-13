import {MinLength, MaxLength, IsEmail, IsFQDN, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize} from "../../src/decorator/decorators";
import {IsDate} from "../../src/decorator/IsDate";
import {IsInt} from "../../src/decorator/IsInt";
import {IsEnum} from "../../src/decorator/IsEnum";
import {Contains} from "../../src/decorator/Contains";

export enum PostType {
    Public,
    Private
}

export class Post {

    @MinLength(10)
    @MaxLength(20)
    title: string;

    @Contains("hello")
    text: string;

    @IsInt()
    rating: number;

    @IsEmail()
    email: string;

    @IsFQDN()
    site: string;

    @IsDate()
    createDate: Date;

    @ArrayNotEmpty()
    @ArrayMinSize(2)
    @ArrayMaxSize(5)
    @MinLength(3, { each: true, message: "Tag is too short. Minimal length is $value characters" })
    @MaxLength(50, { each: true, message: "Tag is too long. Maximal length is $value characters" })
    tags: string[];

    @IsEnum(PostType)
    type: PostType;
}
