import {Validator} from "./Validator";
import {ValidationErrorInterface} from "./ValidationErrorInterface";
import {ValidatorOptions} from "./ValidatorOptions";

export * from "./decorators";
export * from "./ValidatorOptions";
export * from "./Validator";

const validator = new Validator();
export default validator;

export function validate(object: any, validatorOptions?: ValidatorOptions): ValidationErrorInterface[] {
    return validator.validate(object, validatorOptions);
}

export function validateAsync<T>(object: T, validatorOptions?: ValidatorOptions): Promise<T> {
    return validator.validateAsync(object, validatorOptions);
}

export function validateOrThrow(object: any, validatorOptions?: ValidatorOptions): void {
    validator.validateOrThrow(object, validatorOptions);
}

export function isValid(object: any, validatorOptions?: ValidatorOptions): boolean {
    return validator.isValid(object, validatorOptions);
}