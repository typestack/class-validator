import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate } from '../../src/decorator/decorators';

export class Post {
  @Length(10, 20, {
    message: 'Incorrect length!',
    groups: ['users', 'moderators'],
  })
  @Length(0, 20, {
    message: 'Incorrect length!',
    groups: ['admins'],
  })
  title: string;

  @Contains('hello', {
    message: 'It should contain word "hello!"',
    groups: ['users', 'moderators'],
  })
  text: string;

  @IsInt()
  rating: number;

  @IsEmail(undefined, {
    always: true,
  })
  email: string;

  @IsFQDN(undefined, {
    message: 'Site address should be correct',
    groups: ['users'],
  })
  site: string;

  @IsDate()
  createDate: Date;
}
