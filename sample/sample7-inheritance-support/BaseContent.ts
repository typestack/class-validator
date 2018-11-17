import {IsEmail} from "../../src/decorator/IsEmail";

export class BaseContent {

    @IsEmail()
    email: string;

}
