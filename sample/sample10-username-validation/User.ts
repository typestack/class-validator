import { IsUserName, IsEmail, MinLength, MaxLength } from '../../src/decorator/decorators';

export class User {
  @IsUserName()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  email: string;

  // Example with custom allowed characters (allowing dots and commas)
  @IsUserName({ allowedCharacters: '.,' })
  @MinLength(2)
  @MaxLength(100)
  displayName: string;

  // Example with custom message
  @IsUserName(
    undefined,
    { message: 'Username must contain only letters, numbers, spaces, hyphens, and apostrophes' }
  )
  username: string;
}

