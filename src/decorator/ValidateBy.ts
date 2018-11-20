import {ValidationFunction} from "./ValidationFunction";
import {ValidationOptions} from "./ValidationOptions";
import {registerDecorator} from "../register-decorator";
import {ValidationArguments} from "../validation/ValidationArguments";
import {ValidatorConstraintInterface} from "../validation/ValidatorConstraintInterface";

export function buildMessage(
    impl: (eachPrefix: string, args?: ValidationArguments) => string,
    validationOptions?: ValidationOptions)
    : (validationArguments?: ValidationArguments) => string {
    return (validationArguments?: ValidationArguments) => {
        const eachPrefix = validationOptions && validationOptions.each
            ? "each value in "
            : "";
        return impl(eachPrefix, validationArguments);
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
