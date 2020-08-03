import { IsUserAlreadyExist } from './IsUserAlreadyExist';
import { IsLongerThan } from './IsLongerThan';

export class User {
  @IsUserAlreadyExist({
    message: 'User with name $value already exists',
  })
  firstName: string;

  @IsLongerThan('firstName', {
    message: "User's last name must be longer than firstName",
  })
  lastName: string;
}
