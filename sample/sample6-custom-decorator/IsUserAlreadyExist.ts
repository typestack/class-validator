import {registerDecorator} from "../../src/index";
import {ValidationOptions} from "../../src/decorator/ValidationOptions";

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        const constraints: any[] = [/*constraints your decorator can have*/];
        registerDecorator(object, propertyName, validationOptions, constraints, "user_exists", (userName, object, constraints) => {
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