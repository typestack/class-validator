import { IsEmail } from '../../src/decorator/decorators';

export class BaseContent {
  @IsEmail()
  email: string;
}
