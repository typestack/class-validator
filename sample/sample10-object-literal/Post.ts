import { IsString, Length, ValidateNested } from '../../src/decorator/decorators';
import { Tag } from './Tag';

export class Post {
  @Length(10, 20, {
    message: 'Incorrect length!',
  })
  title: string;

  @IsString({
    each: true,
    objectLiteral: true,
  })
  categories: Record<string, unknown>;

  @ValidateNested({
    objectLiteral: true,
  })
  tags: Record<string, Tag>;
}
