import { getClassValidatorMessage } from './messages.storage';

const CLASS_VALIDATOR_MESSAGE_MARKER = '__I18N__';

export function getText(s: string) {
  return getClassValidatorMessage(s) ? [CLASS_VALIDATOR_MESSAGE_MARKER, s, CLASS_VALIDATOR_MESSAGE_MARKER].join('') : s;
}
