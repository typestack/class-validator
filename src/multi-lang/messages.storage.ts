import { getGlobal } from '../utils/get-global.util';

const CLASS_VALIDATOR_MESSAGES = 'CLASS_VALIDATOR_MESSAGES';

export function getClassValidatorMessagesStorage(): { [key: string]: string } {
  const global: { [CLASS_VALIDATOR_MESSAGES]: { [key: string]: string } } = getGlobal();
  if (!global[CLASS_VALIDATOR_MESSAGES]) {
    global[CLASS_VALIDATOR_MESSAGES] = {};
  }
  return global[CLASS_VALIDATOR_MESSAGES];
}

export function setClassValidatorMessages(messages: { [key: string]: string }) {
  const storageMessages = getClassValidatorMessagesStorage();
  Object.keys(storageMessages).forEach(key => delete storageMessages[key]);
  Object.assign(storageMessages, messages);
}

export function getClassValidatorMessages(): { [key: string]: string } {
  return getClassValidatorMessagesStorage();
}

export function getClassValidatorMessage(key: string): string {
  const messages = getClassValidatorMessagesStorage();
  return messages[key];
}
