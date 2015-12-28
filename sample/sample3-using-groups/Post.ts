import {Contains, IsInt, IsLength, IsEmail, IsFQDN, IsDate} from "../../src/decorator/Validation";

export class Post {

    @IsLength(10, 20, {
        message: 'Incorrect length!',
        groups: ['users', 'moderators']
    })
    @IsLength(0, 20, {
        message: 'Incorrect length!',
        groups: ['admins']
    })
    title: string;

    @Contains('hello', {
        message: 'It should contain word "hello!"',
        groups: ['users', 'moderators']
    })
    text: string;

    @IsInt({ min: 0, max: 10 })
    rating: number;

    @IsEmail(null, {
        always: true
    })
    email: string;

    @IsFQDN(null, {
        message: 'Site address should be correct',
        groups: ['users']
    })
    site: string;

    @IsDate()
    createDate: Date;

}