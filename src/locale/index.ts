import en_US from './countries/en_US';

export type Locale = 'en_US';

const DEFAULT_LOCALE = 'en_US';

const locales = {
  en_US,
}

export function getLocale(): Locale {
  const locale = process.env.CLASS_VALIDATOR_LOCALE as Locale;

  if (!locale || !locales[locale]) {
    return DEFAULT_LOCALE;
  }

  return locale;
}

/*
  must be called on start application, to prevent errors
  can be configured directly in .env file, if you using dotenv
*/
export function setLocale(locale: Locale): void {
  if (!locale) {
    removeLocale();

    return;
  }

  if (!locales[locale]) {
    locale = DEFAULT_LOCALE;
  }

  process.env.CLASS_VALIDATOR_LOCALE = locale;
}

export function removeLocale(): void {
  delete process.env.CLASS_VALIDATOR_LOCALE;
}

export function getLocaleMessage(decoratorName: string, property: string = 'message'): string | Function {
  const localeKey = getLocale();
  const locale = locales[localeKey] as any;
  const localeDecorator = locale ? locale[decoratorName] : null;
  const localeMessage = localeDecorator ? localeDecorator[property] : null;

  return localeMessage || '';
}

export default locales;