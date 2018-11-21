import {ValidationOptions} from "../ValidationOptions";
import {buildMessage, ValidateBy} from "../ValidateBy";
import validatorJsIsCreditCard = require("validator/lib/isCreditCard");

export const IS_CREDIT_CARD = "isCreditCard";

/**
 * Checks if the string is a credit card.
 * If given value is not a string, then it returns false.
 */
export function isCreditCard(value: string): boolean {
    return typeof value === "string" && validatorJsIsCreditCard(value);
}


/**
 * Checks if the string is a credit card.
 */
export function IsCreditCard(validationOptions?: ValidationOptions) {
    return ValidateBy({
            name: IS_CREDIT_CARD,
            validate: (value) => isCreditCard(value),
            defaultMessage: buildMessage((eachPrefix) => eachPrefix + "$property must be a credit card", validationOptions)
        },
        validationOptions
    );
}
