import { validate } from '../../index';
import { IsString } from '../typechecker/IsString';
import { IsEmail } from '../string/IsEmail';
import { IsOptional } from '../common/IsOptional';
import { IsInt } from '../typechecker/IsInt';
import { AtLeastOneField, AtLeastOneFieldConstraint } from './AtLeastOneField';

// ─────────────────────────────────────────────
//  Test DTO
// ─────────────────────────────────────────────

@AtLeastOneField()
class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  age?: number;
}

const createDto = (data: Partial<UpdateUserDto>): UpdateUserDto => Object.assign(new UpdateUserDto(), data);

// ─────────────────────────────────────────────
//  Tests
// ─────────────────────────────────────────────

describe('@AtLeastOneField decorator implementation', () => {
  const constraint = new AtLeastOneFieldConstraint();

  describe('validate', () => {
    it('should return true when at least one field has a value', () => {
      expect(constraint.validate(null, { object: { name: 'Alice' } } as any)).toBe(true);
      expect(constraint.validate(null, { object: { email: 'alice@test.com' } } as any)).toBe(true);
      expect(constraint.validate(null, { object: { age: 25 } } as any)).toBe(true);
      expect(constraint.validate(null, { object: { name: 'Alice', email: 'alice@test.com' } } as any)).toBe(true);
    });

    it('should return false when all fields are empty', () => {
      expect(constraint.validate(null, { object: {} } as any)).toBe(false);
      expect(constraint.validate(null, { object: { name: '' } } as any)).toBe(false);
      expect(constraint.validate(null, { object: { name: null } } as any)).toBe(false);
      expect(constraint.validate(null, { object: { name: undefined } } as any)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct error message', async () => {
      const errors = await validate(createDto({}));
      const message = Object.values(errors[0].constraints ?? {}).join('');
      expect(message).toBe('At least one of the following fields must be provided: [name, email, age]');
    });

    it('should not have empty fields in the list', async () => {
      const errors = await validate(createDto({}));
      const message = Object.values(errors[0].constraints ?? {}).join('');
      expect(message).not.toContain('[,'); // no leading comma
      expect(message).not.toContain(', ]'); // no trailing comma
      expect(message).not.toContain('[]'); // no empty list
    });
  });
});
