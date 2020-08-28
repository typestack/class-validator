export const I18N_MESSAGES: { [key: string]: string } = {};

export function getText(s: string) {
  return I18N_MESSAGES[s] || s;
}
