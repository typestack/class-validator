import { ValidationArguments } from '../../validation/ValidationArguments';

export default {
  arrayContains: {
    message: '$property must contain $constraint1 values',
  },
  arrayMaxSize: {
    message: '$property must contain no more than $constraint1 elements',
  },
  arrayMinSize: {
    message: '$property must contain at least $constraint1 elements',
  },
  arrayNotContains: {
    message: '$property should not contain $constraint1 values',
  },
  arrayNotEmpty: {
    message: '$property should not be empty',
  },
  arrayUnique: {
    message: 'All $property\'s elements must be unique',
  },
  equals: {
    message: '$property must be equal to $constraint1',
  },
  isDefined: {
    message: '$property should not be null or undefined',
  },
  isEmpty: {
    message: '$property must be empty',
  },
  isIn: {
    message: '$property must be one of the following values: $constraint1',
  },
  isLatitude: {
    message: '$property must be a latitude string or number',
  },
  isLatLong: {
    message: '$property must be a latitude,longitude string',
  },
  isLongitude: {
    message: '$property must be a longitude string or number',
  },
  isNotEmpty: {
    message: '$property should not be empty',
  },
  isNotIn: {
    message: '$property should not be one of the following values: $constraint1',
  },
  notEquals: {
    message: '$property should not be equal to $constraint1',
  },
  maxDate: {
    message: (eachPrefix: string) => {
      return 'maximal allowed date for ' + eachPrefix + '$property is $constraint1';
    },
  },
  minDate: {
    message: (eachPrefix: string) => {
      return 'minimal allowed date for ' + eachPrefix + '$property is $constraint1';
    },
  },
  isDivisibleBy: {
    message: '$property must be divisible by $constraint1',
  },
  isNegative: {
    message: '$property must be a negative number',
  },
  isPositive: {
    message: '$property must be a positive number',
  },
  max: {
    message: '$property must not be greater than $constraint1',
  },
  min: {
    message: '$property must not be less than $constraint1',
  },
  isInstance: {
    message: (eachPrefix: string, args: ValidationArguments, decoratorName: string) => {
      if (args?.constraints[0]) {
        return eachPrefix + `$property must be an instance of ${args?.constraints[0].name as string}`;
      } else {
        return eachPrefix + `${decoratorName} decorator expects and object as value, but got falsy value.`;
      }
    },
  },
  isNotEmptyObject: {
    message: '$property must be a non-empty object',
  },
  contains: {
    message: '$property must contain a $constraint1 string',
  },
  isISO4217CurrencyCode: {
    message: '$property must be a valid ISO4217 currency code',
  },
  isTaxId: {
    message: '$property must be a Tax Identification Number',
  },
  isAlpha: {
    message: '$property must contain only letters (a-zA-Z)',
  },
  isAlphanumeric: {
    message: '$property must contain only letters and numbers',
  },
  isAscii: {
    message: '$property must contain only ASCII characters',
  },
  isBase32: {
    message: '$property must be base32 encoded',
  },
  isBase58: {
    message: '$property must be base58 encoded',
  },
  isBase64: {
    message: '$property must be base64 encoded',
  },
  isBIC: {
    message: '$property must be a BIC or SWIFT code',
  },
  isBooleanString: {
    message: '$property must be a boolean string',
  },
  isBtcAddress: {
    message: '$property must be a BTC address',
  },
  isByteLength: {
    message: '$property\'s byte length must fall into ($constraint1, $constraint2) range',
  },
  isCreditCard: {
    message: '$property must be a credit card',
  },
  isCurrency: {
    message: '$property must be a currency',
  },
  isDataURI: {
    message: '$property must be a data uri format',
  },
  isDateString: {
    message: '$property must be a valid ISO 8601 date string',
  },
  isDecimal: {
    message: '$property is not a valid decimal number.',
  },
  isEAN: {
    message: '$property must be an EAN (European Article Number)',
  },
  isEmail: {
    message: '$property must be an email',
  },
  isEthereumAddress: {
    message: '$property must be an Ethereum address',
  },
  IsFirebasePushId: {
    message: '$property must be a Firebase Push Id',
  },
  isFqdn: {
    message: '$property must be a valid domain name',
  },
  isFullWidth: {
    message: '$property must contain a full-width characters',
  },
  isHalfWidth: {
    message: '$property must contain a half-width characters',
  },
  isHash: {
    message: '$property must be a hash of type $constraint1',
  },
  isHexadecimal: {
    message: '$property must be a hexadecimal number',
  },
  isHexColor: {
    message: '$property must be a hexadecimal color',
  },
  isHSL: {
    message: '$property must be a HSL color',
  },
  isIBAN: {
    message: '$property must be an IBAN',
  },
  isIdentityCard: {
    message: '$property must be a identity card number',
  },
  isIp: {
    message: '$property must be an ip address',
  },
  isIsbn: {
    message: '$property must be an ISBN',
  },
  isIsin: {
    message: '$property must be an ISIN (stock/security identifier)',
  },
  isIso8601: {
    message: '$property must be a valid ISO 8601 date string',
  },
  isISO31661Alpha2: {
    message: '$property must be a valid ISO31661 Alpha2 code',
  },
  isISO31661Alpha3: {
    message: '$property must be a valid ISO31661 Alpha3 code',
  },
  isISRC: {
    message: '$property must be an ISRC',
  },
  isISSN: {
    message: '$property must be a ISSN',
  },
  isJson: {
    message: '$property must be a json string',
  },
  isJwt: {
    message: '$property must be a jwt string',
  },
  isLocale: {
    message: '$property must be locale',
  },
  isLowercase: {
    message: '$property must be a lowercase string',
  },
  isMacAddress: {
    message: '$property must be a MAC Address',
  },
  isMagnetURI: {
    message: '$property must be magnet uri format',
  },
  isMilitaryTime: {
    message: '$property must be a valid representation of military time in the format HH:MM',
  },
  isMimeType: {
    message: '$property must be MIME type format',
  },
  isMobilePhone: {
    message: '$property must be a phone number',
  },
  isMongoId: {
    message: '$property must be a mongodb id',
  },
  isMultibyte: {
    message: '$property must contain one or more multibyte chars',
  },
  isNumberString: {
    message: '$property must be a number string',
  },
  isOctal: {
    message: '$property must be valid octal number',
  },
  isPassportNumber: {
    message: '$property must be valid passport number',
  },
  isPhoneNumber: {
    message: '$property must be a valid phone number',
  },
  isPort: {
    message: '$property must be a port',
  },
  isPostalCode: {
    message: '$property must be a postal code',
  },
  isRFC3339: {
    message: '$property must be RFC 3339 date',
  },
  isRgbColor: {
    message: '$property must be RGB color',
  },
  isSemVer: {
    message: '$property must be a Semantic Versioning Specification',
  },
  isStrongPassword: {
    message: '$property is not strong enough',
  },
  isSurrogatePair: {
    message: '$property must contain any surrogate pairs chars',
  },
  isTimeZone: {
    message: '$property must be a valid IANA time-zone',
  },
  isUppercase: {
    message: '$property must be uppercase',
  },
  isUrl: {
    message: '$property must be a URL address',
  },
  isUuid: {
    message: '$property must be a UUID',
  },
  isVariableWidth: {
    message: '$property must contain a full-width and half-width characters',
  },
  isLength: {
    message: (eachPrefix: string, args: ValidationArguments) => {
      const isMinLength = args?.constraints[0] !== null && args?.constraints[0] !== undefined;
      const isMaxLength = args?.constraints[1] !== null && args?.constraints[1] !== undefined;

      if (isMinLength && (!args.value || args.value.length < args?.constraints[0])) {
        return eachPrefix + '$property must be longer than or equal to $constraint1 characters';
      } else if (isMaxLength && args.value.length > args?.constraints[1]) {
        return eachPrefix + '$property must be shorter than or equal to $constraint2 characters';
      }

      return (
        eachPrefix +
        '$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters'
      );
    },
  },
  matches: {
    message: '$property must match $constraint1 regular expression',
  },
  maxLength: {
    message: '$property must be shorter than or equal to $constraint1 characters',
  },
  minLength: {
    message: '$property must be longer than or equal to $constraint1 characters',
  },
  notContains: {
    message: '$property should not contain a $constraint1 string',
  },
  isArray: {
    message: '$property must be an array',
  },
  isBoolean: {
    message: '$property must be a boolean value',
  },
  isDate: {
    message: '$property must be a Date instance',
  },
  isEnum: {
    message: '$property must be one of the following values: $constraint2',
  },
  isInt: {
    message: '$property must be an integer number',
  },
  isNumber: {
    message: '$property must be a number conforming to the specified constraints',
  },
  isObject: {
    message: '$property must be an object',
  },
  isString: {
    message: '$property must be a string',
  },
}