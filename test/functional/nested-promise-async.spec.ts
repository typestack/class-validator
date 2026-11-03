import {
  validateOrReject,
  IsString,
  validate,
  Validate,
  ValidateNested,
  ValidatePromise,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from '../../src';

@ValidatorConstraint({ async: true })
class DelayedInvalid implements ValidatorConstraintInterface {
  async validate(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return false;
  }
}

describe('asynchronous validation inside promised values', () => {
  it('waits for an async constraint inside a promised nested object', async () => {
    class Child {
      @Validate(DelayedInvalid)
      value = 'invalid';
    }
    class Parent {
      @ValidatePromise()
      @ValidateNested()
      child = Promise.resolve(new Child());
    }

    const errors = await validate(new Parent());
    expect(errors).toHaveLength(1);
    expect(errors[0].children[0].constraints).toHaveProperty('DelayedInvalid');
  });

  it('rejects after validating multiple levels of promised children', async () => {
    class Child {
      @Validate(DelayedInvalid)
      value = 'invalid';
    }
    class Middle {
      @ValidatePromise()
      @ValidateNested()
      child = Promise.resolve(new Child());
    }
    class Parent {
      @ValidatePromise()
      @ValidateNested()
      middle = Promise.resolve(new Middle());
    }
    await expect(validateOrReject(new Parent())).rejects.toMatchObject([
      { property: 'middle', children: [{ property: 'child', children: [{ property: 'value' }] }] },
    ]);
  });

  it('retains successful promised validation and propagates rejected promises', async () => {
    class Parent {
      @ValidatePromise()
      @IsString()
      value: Promise<string>;
    }
    const parent = new Parent();
    parent.value = Promise.resolve('valid');
    await expect(validate(parent)).resolves.toEqual([]);
    const failure = new Error('failed to load value');
    parent.value = Promise.reject(failure);
    await expect(validate(parent)).rejects.toBe(failure);
  });
});
