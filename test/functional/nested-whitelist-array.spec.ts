import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from '../../src/decorator/decorators';
import { Validator } from '../../src/validation/Validator';
import { ValidationTypes } from '../../src/validation/ValidationTypes';
import { ValidationError } from '../../src/validation/ValidationError';

const validator = new Validator();

describe('nested validation with whitelist on arrays', () => {
  it('should not flag decorated child properties as non-whitelisted when using ValidateNested on array', () => {
    class PolVehicleDump {
      @IsString()
      @IsNotEmpty()
      vin: string;

      @IsInt()
      @IsOptional()
      year: number;

      @IsString()
      @IsOptional()
      make?: string;

      @IsString()
      @IsOptional()
      model?: string;

      @IsInt()
      @IsOptional()
      vehicleTypeCode?: number;
    }

    class PolDump {
      @IsInt({ always: true })
      @IsNotEmpty({ always: true })
      versionNum: number;

      @IsString({ always: true })
      @IsNotEmpty({ always: true })
      polNumber: string;

      @IsString({ always: true })
      @IsNotEmpty({ always: true })
      effectiveDate: string;

      @IsString({ always: true })
      @IsNotEmpty({ always: true })
      expirationDate: string;

      @IsArray({ always: true })
      @ArrayMinSize(0, { always: true })
      @IsOptional({ always: true })
      @ValidateNested({ always: true, each: true })
      polVehicleDumps?: PolVehicleDump[];
    }

    class PolDumpReq {
      @IsArray({ always: true })
      @ArrayMinSize(1, { always: true })
      @ValidateNested({ always: true, each: true })
      polDumps: PolDump[];
    }

    const vehicle = new PolVehicleDump();
    vehicle.vin = 'XXXXXXX';
    vehicle.year = 2005;
    vehicle.make = 'FREIGHTLINER';

    const dump = new PolDump();
    dump.versionNum = 1;
    dump.polNumber = '123123';
    dump.effectiveDate = '2020-12-10';
    dump.expirationDate = '2021-12-10';
    dump.polVehicleDumps = [vehicle];

    const polDumpReq = new PolDumpReq();
    polDumpReq.polDumps = [dump];

    return validator.validate(polDumpReq, { whitelist: true, forbidNonWhitelisted: true }).then(errors => {
      const flat = (errs: ReadonlyArray<ValidationError>): ValidationError[] =>
        errs.flatMap((e: ValidationError) => [e, ...(e.children ? flat(e.children) : [])]);
      const all = flat(errors);
      const hasWhitelist = all.some(e => e.constraints && e.constraints[ValidationTypes.WHITELIST]);
      expect(hasWhitelist).toBe(false);
    });
  });
});
