import { Validator } from "./Validator";
import { ValidationError } from "./ValidationError";
import { ValidationMetadata } from "../metadata/ValidationMetadata";
import { ValidatorOptions } from "./ValidatorOptions";
/**
 * Executes validation over given object.
 */
export declare class ValidationExecutor {
    private validator;
    private validatorOptions?;
    awaitingPromises: Promise<any>[];
    ignoreAsyncValidations: boolean;
    private metadataStorage;
    constructor(validator: Validator, validatorOptions?: ValidatorOptions);
    execute(object: Object, targetSchema: string, validationErrors: ValidationError[], entryPoint?: any): void;
    whitelist(object: any, groupedMetadatas: {
        [propertyName: string]: ValidationMetadata[];
    }, validationErrors: ValidationError[]): void;
    stripEmptyErrors(errors: ValidationError[]): ValidationError[];
    private generateValidationError;
    private conditionalValidations;
    private defaultValidations;
    private customValidations;
    private nestedValidations;
    private mapContexts;
    private createValidationError;
    private getConstraintType;
}
//# sourceMappingURL=ValidationExecutor.d.ts.map