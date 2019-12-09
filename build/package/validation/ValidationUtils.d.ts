import { ValidationArguments } from "./ValidationArguments";
export declare class ValidationUtils {
    static replaceMessageSpecialTokens(message: string | ((args: ValidationArguments) => string), validationArguments: ValidationArguments): string;
}
