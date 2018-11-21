import {IsEmail} from "../../src/decorator/string/IsEmail";

export class BaseContent {

    @IsEmail()
    email: string;

}
