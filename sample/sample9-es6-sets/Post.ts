import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, ValidateNested } from '../../src/decorator/decorators';
import { Tag } from './Tag';

export class Post {
  @Length(10, 20, {
    message: 'Incorrect length!',
  })
  title: string;

  @ValidateNested()
  tags: Set<Tag>;
}
