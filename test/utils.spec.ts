import { convertToArray } from '../src/utils';

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

  it('should return array untouched', () => {
    const arr = ['hello', 'world'];
    expect(arr).toBeInstanceOf(Array);
    expect(arr.length).toEqual(2);
    expect(arr).toContain('hello');
    expect(arr).toContain('world');
  });
});
