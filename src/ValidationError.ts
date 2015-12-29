import {ValidationErrorInterface} from "./ValidationErrorInterface";

/**
 * Error thrown if validation failed.
 */
export class ValidationError extends Error {
    name = "ValidationError";
    errors: ValidationErrorInterface[];

    constructor(errors: ValidationErrorInterface[]) {
        super();
        this.message = "Validation failed";
        this.errors = errors;
    }
}