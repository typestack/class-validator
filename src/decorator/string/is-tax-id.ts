import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isTaxIDValidator from 'validator/lib/isTaxID';

export const IS_TAX_ID = 'isTaxId';

/**
 * Checks if the string is a valid tax ID. Default locale is `en-US`.
 * If given value is not a string, then it returns false.
 *
 * Supported locales: bg-BG, cs-CZ, de-AT, de-DE, dk-DK, el-CY, el-GR, en-CA,
 * en-IE, en-US, es-ES, et-EE, fi-FI, fr-BE, fr-FR, fr-LU, hr-HR, hu-HU, it-IT,
 * lv-LV, mt-MT, nl-NL, pl-PL, pt-BR, pt-PT, ro-RO, sk-SK, sl-SI, sv-SE.
 */
export function isTaxId(value: unknown, locale?: string): boolean {
  return typeof value === 'string' && isTaxIDValidator(value, locale || 'en-US');
}

/**
 * Checks if the string is a valid tax ID. Default locale is `en-US`.
 * If given value is not a string, then it returns false.
 *
 * Supported locales: bg-BG, cs-CZ, de-AT, de-DE, dk-DK, el-CY, el-GR, en-CA,
 * en-IE, en-US, es-ES, et-EE, fi-FI, fr-BE, fr-FR, fr-LU, hr-HR, hu-HU, it-IT,
 * lv-LV, mt-MT, nl-NL, pl-PL, pt-BR, pt-PT, ro-RO, sk-SK, sl-SI, sv-SE.
 */
export function IsTaxId(locale?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_TAX_ID,
      constraints: [locale],
      validator: {
        validate: (value, args): boolean => isTaxId(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a Tax Identification Number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
