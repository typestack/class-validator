import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "../../src/annotation/ValidationAnnotations";

export class Post {

    @IsLength(10, 20)
    title: string;

    @Contains('hello')
    text: string;

    @IsInt({ min: 0, max: 10 })
    rating: number;

    @IsEmail()
    email: string;

    @IsFQDN()
    site: string;

    @IsDate()
    createDate: Date;

}