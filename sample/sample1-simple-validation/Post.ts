import {IsDate} from "../../src/decorator/typechecker/IsDate";
import {IsInt} from "../../src/decorator/typechecker/IsInt";
import {IsEnum} from "../../src/decorator/typechecker/IsEnum";
import {Contains} from "../../src/decorator/string/Contains";
import {IsEmail} from "../../src/decorator/string/IsEmail";
import {IsFQDN} from "../../src/decorator/string/IsFQDN";
import {MinLength} from "../../src/decorator/string/MinLength";
import {MaxLength} from "../../src/decorator/string/MaxLength";
import {ArrayNotEmpty} from "../../src/decorator/array/ArrayNotEmpty";
import {ArrayMinSize} from "../../src/decorator/array/ArrayMinSize";
import {ArrayMaxSize} from "../../src/decorator/array/ArrayMaxSize";

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
