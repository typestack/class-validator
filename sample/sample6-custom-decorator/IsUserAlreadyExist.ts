import {registerDecorator} from "../../src/index";
import {ValidationOptions} from "../../src/decorator/ValidationOptions";

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator(object, propertyName, validationOptions, [], "user_exists", userName => {
            return new Promise(ok => {
                if (userName !== "admin" && userName !== "user") {
                    ok(true);
                } else {
                    ok(false);
                }
            });
        });
    };
}