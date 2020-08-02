import {
  Contains,
  IsInt,
  MinLength,
  MaxLength,
  IsEmail,
  IsFQDN,
  IsDate,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from '../../src/decorator/decorators';
import { Validate } from '../../src/decorator/decorators';
import { CustomTextLength } from './CustomTextLength';

export class Post {
  @Validate(CustomTextLength, {
    message: 'Wrong post title',
  })
  title: string;
}
