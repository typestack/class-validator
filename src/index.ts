import {Validator} from "./validation/Validator";
import {ValidationError} from "./validation/ValidationError";
import {ValidatorOptions} from "./validation/ValidatorOptions";

// -------------------------------------------------------------------------
// Global Container
// -------------------------------------------------------------------------

/**
 * Container to be used by this library for inversion control. If container was not implicitly set then by default
 * container simply creates a new instance of the given class.
 */
let container: { get<T>(someClass: { new (...args: any[]): T }|Function): T } = new (class {
    private instances: any[] = [];
    get<T>(someClass: { new (...args: any[]): T }): T {
        if (!this.instances[<any>someClass])
            this.instances[<any>someClass] = new someClass();

        return this.instances[<any>someClass];
    }
})();

/**
 * Sets container to be used by this library.
 *
 * @param iocContainer
 */
export function useContainer(iocContainer: { get(someClass: any): any }) {
    container = iocContainer;
}

/**
 * Gets the IOC container used by this library.
 */
export function getFromContainer<T>(someClass: { new (...args: any[]): T }|Function): T {
    return container.get<T>(someClass);
}

// -------------------------------------------------------------------------
// Export everything api users needs
// -------------------------------------------------------------------------

export * from "./decorator/decorators";
export * from "./decorator/ValidationOptions";
export * from "./validation/CustomValidator";
export * from "./validation/ValidationError";
export * from "./validation/ValidationTypeOptions";
export * from "./validation/ValidatorOptions";
export * from "./validation/Validator";

// -------------------------------------------------------------------------
// Shortcut methods for api users
// -------------------------------------------------------------------------

export function validate(object: any, validatorOptions?: ValidatorOptions): Promise<ValidationError[]> {
    return getFromContainer(Validator).validate(object, validatorOptions);
}