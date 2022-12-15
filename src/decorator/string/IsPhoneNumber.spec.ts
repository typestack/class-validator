import { isPhoneNumber } from './IsPhoneNumber';

describe('@IsPhoneNumber decorator implementation', () => {
  describe('isPhoneNumber validator', () => {
    it('should accept valid values', () => {
      expect(isPhoneNumber('+36 20 111 1111', 'HU')).toBe(true);
    });

    describe('should not accept invalid values', () => {
      it('when country code invalid', () => {
        expect(isPhoneNumber('+1 20 111 1111', 'HU')).toBe(false);
      });

      it('when country code does not match locale', () => {
        expect(isPhoneNumber('+36 00 111 1111', 'HU')).toBe(false);
      });

      it('when phone number length is incorrect', () => {
        expect(isPhoneNumber('+36 20 111 111', 'HU')).toBe(false);
      });

      it('when there are letters after or before the phone number', () => {
        expect(isPhoneNumber('abc +36 20 111 111', 'HU')).toBe(false);
        expect(isPhoneNumber('+36 20 111 111 abc', 'HU')).toBe(false);
      });
    });

    it('should not accept values with extra whitespace', () => {
      expect(isPhoneNumber('  +36 20 111 1111', 'HU')).toBe(false);
      expect(isPhoneNumber('+36 20 111 1111  ', 'HU')).toBe(false);
    });
  });
});
