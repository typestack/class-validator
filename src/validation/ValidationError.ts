/**
 * Validation error description.
 */
export class ValidationError {

    /**
     * Value of that target's property, that didn't pass a validation.
     */
    value: any;

    /**
     * Name of the target class that was validated.
     */
    target: Object;

    /**
     * Target's property on which validation is applied.
     */
    property: string;

    /**
     * Type-message key-values.
     */
    errors: {
        [type: string]: string
    };

    /**
     * If property has nested validation, then it goes throw the validation and childProperties contain their
     * validation errors.
     */
    childProperties: ValidationError[];

}

/*
const tree = [{
    target: {},
    property: "name",
    value: "aa",
    errors: [{
        type: "min_length",
        message: "Name is too short"
    }, {
        type: "max_length",
        message: "Name is too long"
    }]
}, {
    property: "description",
    errors: [{
        type: "min_length",
        message: "Description is too short"
    }, {
        type: "max_length",
        message: "Description is too long"
    }]
}, {
    property: "tags",
    errors: [{
        type: "min_length",
        message: "Description is too short"
    }, {
        type: "max_length",
        message: "Description is too long"
    }],
    childProperties: [{
        property: "name",
        errors: [{
            type: "min_length",
            message: "Name is too short"
        }, {
            type: "max_length",
            message: "Name is too long"
        }]
    }]
}];*/
