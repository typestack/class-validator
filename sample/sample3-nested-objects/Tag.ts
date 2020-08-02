import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate } from '../../src/decorator/decorators';

export class Tag {
  @Length(10, 20, {
    message: 'Tag is too short or long',
  })
  name: string;
}
