export const I18N_MESSAGES: { [key: string]: string } = {};

export const I18N_MESSAGES_MARKER = '__I18N__';

export function getText(s: string) {
  return I18N_MESSAGES[s] ? [I18N_MESSAGES_MARKER, s, I18N_MESSAGES_MARKER].join('') : s;
}

export function removeMarkersFromText(s: string) {
  return s.split(I18N_MESSAGES_MARKER).join('');
}

export function textHasMarker(s: string) {
  return s.includes(I18N_MESSAGES_MARKER);
}
