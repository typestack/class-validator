import { MaxDate, MinDate, validateSync } from '../../src';

describe('dynamic date constraint messages', () => {
  it('uses the current minimum date returned by a callback', () => {
    let boundary = new Date('2020-01-01T00:00:00Z');
    class Model {
      @MinDate(() => boundary)
      date = new Date('2019-01-01T00:00:00Z');
    }
    const model = new Model();
    expect(validateSync(model)[0].constraints.minDate).toBe(`minimal allowed date for date is ${boundary}`);
    boundary = new Date('2021-01-01T00:00:00Z');
    expect(validateSync(model)[0].constraints.minDate).toBe(`minimal allowed date for date is ${boundary}`);
  });

  it('uses the callback maximum date with the each prefix', () => {
    const boundary = new Date('2020-01-01T00:00:00Z');
    class Model {
      @MaxDate(() => boundary, { each: true })
      dates = [new Date('2021-01-01T00:00:00Z')];
    }
    expect(validateSync(new Model())[0].constraints.maxDate).toBe(
      `maximal allowed date for each value in dates is ${boundary}`
    );
  });

  it('preserves static date messages and custom message arguments', () => {
    const boundary = new Date('2020-01-01T00:00:00Z');
    const constraint = () => boundary;
    class Model {
      @MinDate(boundary)
      before = new Date('2019-01-01T00:00:00Z');
      @MaxDate(boundary)
      after = new Date('2021-01-01T00:00:00Z');
      @MinDate(constraint, { message: args => (args.constraints[0] === constraint ? 'custom message' : 'changed') })
      custom = new Date('2019-01-01T00:00:00Z');
    }
    const errors = validateSync(new Model());
    expect(errors.find(error => error.property === 'before').constraints.minDate).toBe(
      `minimal allowed date for before is ${boundary}`
    );
    expect(errors.find(error => error.property === 'after').constraints.maxDate).toBe(
      `maximal allowed date for after is ${boundary}`
    );
    expect(errors.find(error => error.property === 'custom').constraints.minDate).toBe('custom message');
  });
});
