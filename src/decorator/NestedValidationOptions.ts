/**
 * Options used to pass to nested validation decorators.
 */
export interface NestedValidationOptions {

    /**
     * Specifies the property name by which the object's parent can be accessed. Defaults to 'parent'.
     */
    parentProperty?: string;
}