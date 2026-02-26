/*
  types of all possible return values of the .getType() in the phone number libphonenumber-js/max library
*/
export type PhoneNumberType =
  | 'FIXED_LINE_OR_MOBILE'
  | 'MOBILE'
  | 'FIXED_LINE'
  | 'PREMIUM_RATE'
  | 'TOLL_FREE'
  | 'SHARED_COST'
  | 'VOIP'
  | 'PERSONAL_NUMBER'
  | 'PAGER'
  | 'UAN'
  | 'VOICEMAIL';

  export const allPhoneNumberTypes:Array<PhoneNumberType> = [
    'FIXED_LINE_OR_MOBILE',
    'MOBILE',
    'FIXED_LINE',
    'PREMIUM_RATE',
    'TOLL_FREE',
    'SHARED_COST',
    'VOIP',
    'PERSONAL_NUMBER',
    'PAGER',
    'UAN',
    'VOICEMAIL',
  ];