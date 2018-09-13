import {ValidationArguments} from "../index";

export interface ValidationFunction {
    name: string;
    constraints?: any[];
    validate: (value: any, validationArguments?: ValidationArguments) => Promise<boolean>|boolean;
    defaultMessage: (validationArguments?: ValidationArguments) => string;
    async?: boolean;
}
