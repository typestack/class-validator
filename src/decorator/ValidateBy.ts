// -------------------------------------------------------------------------
import {ValidationFunction} from "./ValidationFunction";
import {ValidationOptions} from "./ValidationOptions";
import {registerDecorator} from "../register-decorator";
import {ValidationArguments, ValidatorConstraintInterface} from "..";

export function buildMessage(impl: (eachPrefix: string) => string, validationOptions?: ValidationOptions):
    (validationArguments?: ValidationArguments) => string {
    return () => {
        const eachPrefix = validationOptions && validationOptions.each
            ? "each value in "
            : "";
        return impl(eachPrefix);
    };
}

export function ValidateBy(validator: ValidationFunction, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: validator.name,
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: validator.constraints,
            validator: <ValidatorConstraintInterface> {
                validate: validator.validate,
                defaultMessage: validator.defaultMessage
            }
        });
    };
}
