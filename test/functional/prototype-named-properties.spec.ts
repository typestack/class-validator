import { Allow, IsString, validate, validateSync } from '../../src';

describe('properties sharing Object.prototype names', () => {
  it.each(['toString', 'hasOwnProperty', '__proto__'])('validates a decorated %s property', async property => {
    class Model {}
    IsString()(Model.prototype, property);
    const model = new Model();
    Object.defineProperty(model, property, { value: 123, writable: true, enumerable: true, configurable: true });
    const errors = await validate(model);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe(property);
    expect(errors[0].constraints).toHaveProperty('isString');
    Object.defineProperty(model, property, { value: 'valid' });
    expect(validateSync(model)).toEqual([]);
  });

  it('strips undeclared prototype-named fields when whitelisting', () => {
    class Model {
      @Allow()
      kept = 'value';
    }
    const model = new Model();
    for (const property of ['toString', 'hasOwnProperty', '__proto__']) {
      Object.defineProperty(model, property, { value: 'extra', enumerable: true, configurable: true });
    }
    expect(validateSync(model, { whitelist: true })).toEqual([]);
    expect(Object.keys(model)).toEqual(['kept']);
  });
});
