import { convertToArray, isObjectLiteral } from '../src/utils';

describe('convertToArray', () => {
  it('convert Set into array', () => {
    const setExample = new Set<string>();
    setExample.add('hello');
    setExample.add('world');
    const newArr = convertToArray(setExample);
    expect(newArr).toBeInstanceOf(Array);
    expect(newArr.length).toEqual(2);
    expect(newArr).toContain('hello');
    expect(newArr).toContain('world');
  });

  it('convert Map into array of values', () => {
    const map = new Map<string, string>();
    map.set('key1', 'hello');
    map.set('key2', 'world');
    const newArr = convertToArray(map);
    expect(newArr).toBeInstanceOf(Array);
    expect(newArr.length).toEqual(2);
    expect(newArr).toContain('hello');
    expect(newArr).toContain('world');
  });

  it('convert Literal Object into array of values', () => {
    const object = {
      key1: 'hello',
      key2: 'world',
    };
    const newArr = convertToArray(object);
    expect(newArr).toBeInstanceOf(Array);
    expect(newArr.length).toEqual(2);
    expect(newArr).toContain('hello');
    expect(newArr).toContain('world');
  });

  it('should return array untouched', () => {
    const arr = ['hello', 'world'];
    expect(arr).toBeInstanceOf(Array);
    expect(arr.length).toEqual(2);
    expect(arr).toContain('hello');
    expect(arr).toContain('world');
  });
});

describe('isObjectLiteral', () => {
  it('check is object is object literal', () => {
    expect(
      isObjectLiteral({
        foo: 'bar',
        bar: 'foo',
      })
    ).toEqual(true);
  });

  it('check is Object is object literal', () => {
    expect(
      isObjectLiteral(
        new Object({
          foo: 'bar',
          bar: 'foo',
        })
      )
    ).toEqual(true);
  });

  it("check is array isn't object literal", () => {
    expect(isObjectLiteral(['foo', 'bar'])).toEqual(false);
  });

  it("check is Date isn't object literal", () => {
    expect(isObjectLiteral(new Date())).toEqual(false);
  });

  it("check is custom class isn't object literal", () => {
    class Foo {
      bar: string;
    }
    const fooInstance = new Foo();
    fooInstance.bar = 'baz';

    expect(isObjectLiteral(fooInstance)).toEqual(false);
  });
});
