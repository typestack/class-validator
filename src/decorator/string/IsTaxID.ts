import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isTaxIDValidator from 'validator/lib/isTaxID';

export const IS_TAX_ID = 'isCreditCard';

/**
 * Checks if the string is a credit card.
 * If given value is not a string, then it returns false.
 */
export function isTaxID(value: unknown): boolean {
    return typeof value === 'string' && isTaxIDValidator(value);
}

/**
 * Checks if the string is a credit card.
 * If given value is not a string, then it returns false.
 */
export function IsTaxID(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_TAX_ID,
            validator: {
                validate: (value, args): boolean => isTaxID(value),
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be taxID', validationOptions),
            },
        },
        validationOptions
    );
}
