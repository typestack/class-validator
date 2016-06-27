import {Contains, IsInt, MinLength, MaxLength, IsEmail, IsFQDN, IsDate, NotEmpty, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize} from "../../src/decorator/decorators";

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
    @MinLength(3, { each: true, message: "Tag is too short" })
    @MaxLength(50, { each: true, message: "Tag is too long" })
    tags: string[];

}