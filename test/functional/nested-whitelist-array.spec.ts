import { IsInt, IsOptional, IsString, ValidateNested } from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { ValidationTypes } from '../../src/validation/ValidationTypes';

const validator = new Validator();

describe('nested validation with whitelist on arrays', () => {
  it('should not flag decorated child properties as non-whitelisted when using ValidateNested on array', () => {
    class VehicleDump {
      @IsString()
      vin: string;

      @IsInt()
      @IsOptional()
      year?: number;

      @IsString()
      @IsOptional()
      make?: string;
    }

    class Parent {
      @ValidateNested({ each: true })
      vehicleDumps: VehicleDump[];
    }

    const parent = new Parent();
    parent.vehicleDumps = [
      {
        vin: 'XXXXXXX',
        year: 2005,
        make: 'FREIGHTLINER',
      },
    ];

    return validator
      .validate(parent, { whitelist: true, forbidNonWhitelisted: true })
      .then(errors => {
        // Should not report whitelist errors for child properties like "vin" or "year"
        // i.e., no constraint of type ValidationTypes.WHITELIST anywhere in the tree
        const stringify = (e: any): string => JSON.stringify(e);
        const flat = (errs: any[]): any[] =>
          errs.flatMap(e => [e, ...(e.children ? flat(e.children) : [])]);
        const all = flat(errors);
        const hasWhitelist = all.some(e => e.constraints && e.constraints[ValidationTypes.WHITELIST]);
        expect(hasWhitelist).toBe(false);
      });
  });
});


