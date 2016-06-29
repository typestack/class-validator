import {IsUserAlreadyExist} from "./IsUserAlreadyExist";
import {IsLongerThen} from "./IsLongerThen";

export class User {

    @IsUserAlreadyExist({
        message: "User with name $value already exists"
    })
    firstName: string;

    @IsLongerThen("firstName", {
        message: "User's last name must be longer then firstName"
    })
    lastName: string;
    
}