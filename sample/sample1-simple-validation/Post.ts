import {IsContain, IsInt, IsMinLength, IsMaxLength, IsEmail, IsFQDN, IsDate, IsNotEmpty, IsNotEmptyArray, IsMinSize, IsMaxSize} from "../../src/decorator/decorators";

export class Post {

    @IsMinLength(10)
    @IsMaxLength(20)
    title: string;

    @IsContain("hello")
    text: string;

    @IsInt({ min: 0, max: 10 })
    rating: number;

    @IsEmail()
    email: string;

    @IsFQDN()
    site: string;

    @IsDate()
    createDate: Date;

    @IsNotEmptyArray()
    @IsMinSize(2)
    @IsMaxSize(5)
    @IsMinLength(3, { each: true, message: "Tag is too short" })
    @IsMaxLength(50, { each: true, message: "Tag is too long" })
    tags: string[];

}