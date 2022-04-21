import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isTaxIDValidator from 'validator/lib/isTaxID';

export const IS_TAX_ID = 'isTaxID';

/**
 * Checks if the string is a credit card.
 * (locale is one of ['bg-BG'],['cs-CZ'],['de-AT'],['de-DE'],['dk-DK'],['el-CY'],['el-GR'],['en-CA'],['en-GB'],['en-IE'],['en-US'],['es-ES'],['et-EE'],['fi-FI'],['fr-BE'],['fr-FR'],['fr-LU'],['hu-HU'],['it-IT'],['lv-LV'],['mt-MT'],['nl-NL'],['pl-PL'],['ro-RO'],['sv-SE']).
 * If given value is not a string, then it returns false.
 */
export function isTaxID(value: unknown, locale: string): boolean {
  return typeof value === 'string' && isTaxIDValidator(value, locale);
}

/**
 * Checks if the string is a credit card.
 * (locale is one of ['bg-BG'],['cs-CZ'],['de-AT'],['de-DE'],['dk-DK'],['el-CY'],['el-GR'],['en-CA'],['en-GB'],['en-IE'],['en-US'],['es-ES'],['et-EE'],['fi-FI'],['fr-BE'],['fr-FR'],['fr-LU'],['hu-HU'],['it-IT'],['lv-LV'],['mt-MT'],['nl-NL'],['pl-PL'],['ro-RO'],['sv-SE']).
 * If given value is not a string, then it returns false.
 */
export function IsTaxID(locale: string = 'en-US', validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_TAX_ID,
      validator: {
        validate: (value, args): boolean => isTaxID(value, locale),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a Tax Identification Number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
