import { getGlobal } from '../utils/get-global.util';

interface ClassValidatorTitle {
  target: object;
  titles: Map<string | symbol, string>;
}

interface ClassValidatorPropertyTitle {
  target: object;
  titles: Map<string | symbol, string>;
}

const CLASS_VALIDATOR_PROPERTY_TITLES = 'CLASS_VALIDATOR_PROPERTY_TITLES';

const CLASS_VALIDATOR_TITLES = 'CLASS_VALIDATOR_TITLES';
const CLASS_VALIDATOR_ROOT_TITLE = 'CLASS_VALIDATOR_ROOT_TITLE';

export function setClassValidatorPropertyTitle(object: object, propertyName: string | symbol, title: string) {
  const global: { [CLASS_VALIDATOR_PROPERTY_TITLES]: ClassValidatorPropertyTitle[] } = getGlobal();
  if (!global[CLASS_VALIDATOR_PROPERTY_TITLES]) {
    global[CLASS_VALIDATOR_PROPERTY_TITLES] = [];
  }
  let obj: ClassValidatorPropertyTitle | undefined = (global[CLASS_VALIDATOR_PROPERTY_TITLES] || []).find(
    o => o.target === object.constructor
  );
  if (!obj) {
    obj = { target: object.constructor, titles: new Map() };
    global[CLASS_VALIDATOR_PROPERTY_TITLES].push(obj);
  }
  obj.titles.set(propertyName, title);
}

export function getClassValidatorPropertyTitles(object: object): ClassValidatorPropertyTitle['titles'] {
  const global: { [CLASS_VALIDATOR_PROPERTY_TITLES]: ClassValidatorPropertyTitle[] } = getGlobal();
  const obj: ClassValidatorPropertyTitle | undefined = (global[CLASS_VALIDATOR_PROPERTY_TITLES] || []).find(
    o => o.target === object.constructor
  );
  if (!obj) {
    return new Map();
  }
  return obj.titles;
}

export function getClassValidatorPropertyTitle(object: object, propertyName: string): string | undefined {
  const titles = getClassValidatorPropertyTitles(object);
  return titles.get(propertyName);
}

export function setClassValidatorTitle(object: object, propertyName: string | undefined, title: string) {
  const global: { [CLASS_VALIDATOR_TITLES]: ClassValidatorTitle[] } = getGlobal();
  if (!global[CLASS_VALIDATOR_TITLES]) {
    global[CLASS_VALIDATOR_TITLES] = [];
  }
  let obj: ClassValidatorTitle | undefined = (global[CLASS_VALIDATOR_TITLES] || []).find(o => o.target === object);
  if (!obj) {
    obj = { target: object, titles: new Map() };
    global[CLASS_VALIDATOR_TITLES].push(obj);
  }

  obj.titles.set(propertyName || CLASS_VALIDATOR_ROOT_TITLE, title);
}

export function getClassValidatorTitles(object: object): ClassValidatorTitle['titles'] {
  const global: { [CLASS_VALIDATOR_TITLES]: ClassValidatorTitle[] } = getGlobal();
  const obj: ClassValidatorTitle | undefined = (global[CLASS_VALIDATOR_TITLES] || []).find(
    o => o.target === object.constructor
  );
  if (!obj) {
    return new Map();
  }
  return obj.titles;
}

export function getClassValidatorTitle(object: object, propertyName: string | symbol | undefined): string | undefined {
  const titles = getClassValidatorTitles(object);
  return titles.get(propertyName || CLASS_VALIDATOR_ROOT_TITLE);
}
