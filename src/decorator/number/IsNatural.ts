import {ValidationOptions} from '../ValidationOptions';
import {buildMessage, ValidateBy} from '../common/ValidateBy';

export const IS_NATURAL = 'iSNatural';

/**
 * Checks if the value is a natural number.
 */
export function isNatural(value: unknown): boolean {

    if (typeof value === 'number') {
        return Number.isInteger(value) && value >= 0;

    } else if (typeof value === 'string') {

        return Number.isInteger(+value) && +value >= 0;
    }

    return false;

}

/**
 * Checks if the value is a natural number.
 */
export function IsNatural(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_NATURAL,
            validator: {
                validate: (value, args): boolean => isNatural(value),
                defaultMessage: buildMessage(
                    eachPrefix => eachPrefix + '$property must be a natural number',
                    validationOptions
                ),
            },
        },
        validationOptions
    );
}
