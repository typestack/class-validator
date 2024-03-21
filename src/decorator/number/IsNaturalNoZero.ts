import {ValidationOptions} from '../ValidationOptions';
import {buildMessage, ValidateBy} from '../common/ValidateBy';

export const IS_NATURAL_NO_ZERO = 'iSNaturalNoZero';

/**
 * Checks if the value is a natural number and not zero.
 */
export function isNaturalNoZero(value: unknown): boolean {

    if (typeof value === 'number') {

        return Number.isInteger(value) && value > 0;

    } else if (typeof value === 'string') {

        return Number.isInteger(+value) && +value > 0;
    }

    return false;

}

/**
 * Checks if the value is a natural number and not zero.
 */
export function IsNaturalNoZero(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_NATURAL_NO_ZERO,
            validator: {
                validate: (value, args): boolean => isNaturalNoZero(value),
                defaultMessage: buildMessage(
                    eachPrefix => eachPrefix + '$property must be a natural number and must be greater than zero',
                    validationOptions
                ),
            },
        },
        validationOptions
    );
}
