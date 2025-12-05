import { isUserName } from './IsUserName';

describe('@IsUserName decorator implementation', () => {
  describe('isUserName validator', () => {
    describe('should accept valid usernames with default allowed characters', () => {
      it('should accept names with letters only', () => {
        expect(isUserName('John')).toBe(true);
        expect(isUserName('Mary')).toBe(true);
        expect(isUserName('JeanPierre')).toBe(true);
      });

      it('should accept names with letters and spaces', () => {
        expect(isUserName('John Doe')).toBe(true);
        expect(isUserName('Mary Jane Watson')).toBe(true);
      });

      it('should accept names with hyphens', () => {
        expect(isUserName('Mary-Jane')).toBe(true);
        expect(isUserName('Jean-Pierre')).toBe(true);
        expect(isUserName('O-Brien')).toBe(true);
      });

      it('should accept names with apostrophes', () => {
        expect(isUserName("O'Brien")).toBe(true);
        expect(isUserName("D'Angelo")).toBe(true);
        expect(isUserName("L'Enfant")).toBe(true);
      });

      it('should accept names with numbers', () => {
        expect(isUserName('John123')).toBe(true);
        expect(isUserName('User2')).toBe(true);
        expect(isUserName('Test 123')).toBe(true);
      });

      it('should accept complex valid names', () => {
        expect(isUserName("Mary-Jane O'Brien")).toBe(true);
        expect(isUserName("Jean-Pierre D'Angelo")).toBe(true);
        expect(isUserName("O'Brien-Smith")).toBe(true);
        expect(isUserName('John Doe 123')).toBe(true);
      });
    });

    describe('should not accept invalid usernames with default allowed characters', () => {
      it('should reject names with special characters', () => {
        expect(isUserName('John@Doe')).toBe(false);
        expect(isUserName('John#Doe')).toBe(false);
        expect(isUserName('John$Doe')).toBe(false);
        expect(isUserName('John%Doe')).toBe(false);
        expect(isUserName('John&Doe')).toBe(false);
        expect(isUserName('John*Doe')).toBe(false);
        expect(isUserName('John(Doe)')).toBe(false);
        expect(isUserName('John[Doe]')).toBe(false);
        expect(isUserName('John{Doe}')).toBe(false);
        expect(isUserName('John.Doe')).toBe(false);
        expect(isUserName('John/Doe')).toBe(false);
        expect(isUserName('John\\Doe')).toBe(false);
        expect(isUserName('John|Doe')).toBe(false);
        expect(isUserName('John!Doe')).toBe(false);
        expect(isUserName('John?Doe')).toBe(false);
      });

      it('should reject empty strings', () => {
        expect(isUserName('')).toBe(false);
      });

      it('should reject non-string values', () => {
        expect(isUserName(null as any)).toBe(false);
        expect(isUserName(undefined as any)).toBe(false);
        expect(isUserName(123 as any)).toBe(false);
        expect(isUserName({} as any)).toBe(false);
        expect(isUserName([] as any)).toBe(false);
      });
    });

    describe('should accept valid usernames with custom allowed characters', () => {
      it('should accept names with dots when dots are allowed', () => {
        expect(isUserName('John.Doe', { allowedCharacters: '.' })).toBe(true);
        expect(isUserName('Dr. Smith', { allowedCharacters: '.' })).toBe(true);
      });

      it('should accept names with multiple custom characters', () => {
        expect(isUserName('John.Doe Jr.', { allowedCharacters: '. ' })).toBe(true);
        expect(isUserName('O\'Brien-Smith, Jr.', { allowedCharacters: ',.' })).toBe(true);
      });

      it('should accept names with parentheses when allowed', () => {
        expect(isUserName('John (Johnny) Doe', { allowedCharacters: '()' })).toBe(true);
      });

      it('should accept names with accented characters when specified', () => {
        expect(isUserName('José María', { allowedCharacters: 'éá' })).toBe(true);
      });
    });

    describe('should not accept invalid usernames with custom allowed characters', () => {
      it('should reject names with characters not in the allowed set', () => {
        expect(isUserName('John@Doe', { allowedCharacters: '.' })).toBe(false);
        expect(isUserName('John#Doe', { allowedCharacters: '.' })).toBe(false);
      });

      it('should still reject empty strings even with custom characters', () => {
        expect(isUserName('', { allowedCharacters: '.' })).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle names with only spaces', () => {
        expect(isUserName('   ')).toBe(true); // Spaces are allowed
      });

      it('should handle names with only hyphens', () => {
        expect(isUserName('---')).toBe(true); // Hyphens are allowed
      });

      it('should handle names with only apostrophes', () => {
        expect(isUserName("'''")).toBe(true); // Apostrophes are allowed
      });

      it('should handle very long names', () => {
        const longName = 'A'.repeat(1000) + '-B'.repeat(100);
        expect(isUserName(longName)).toBe(true);
      });

      it('should handle unicode characters in default mode', () => {
        // Unicode letters should be handled by the regex with 'u' flag
        expect(isUserName('José')).toBe(true);
        expect(isUserName('François')).toBe(true);
        expect(isUserName('Müller')).toBe(true);
      });
    });
  });
});


