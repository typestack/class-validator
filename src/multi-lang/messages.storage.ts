import { getGlobal } from '../utils/get-global.util';

export function setClassValidatorMessages(messages: { [key: string]: string }) {
  const global = getGlobal();
  global.CLASS_VALIDATOR_MESSAGES = messages;
}

export function getClassValidatorMessages(): { [key: string]: string } {
  const global = getGlobal();
  if (!global.CLASS_VALIDATOR_MESSAGES) {
    global.CLASS_VALIDATOR_MESSAGES = {};
  }
  return global.CLASS_VALIDATOR_MESSAGES;
}

export function getClassValidatorMessage(key: string): string {
  const messages = getClassValidatorMessages();
  return messages[key];
}
