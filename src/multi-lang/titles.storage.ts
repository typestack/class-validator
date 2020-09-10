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

// PROPERTY
export function getClassValidatorPropertyTitlesStorage(): ClassValidatorPropertyTitle[] {
  const global: { [CLASS_VALIDATOR_PROPERTY_TITLES]: ClassValidatorPropertyTitle[] } = getGlobal();
  if (!global[CLASS_VALIDATOR_PROPERTY_TITLES]) {
    global[CLASS_VALIDATOR_PROPERTY_TITLES] = [];
  }
  return global[CLASS_VALIDATOR_PROPERTY_TITLES];
}

export function setClassValidatorPropertyTitle(object: object, propertyName: string | symbol, title: string) {
  const storagePropertyTitle = getClassValidatorPropertyTitlesStorage();
  let obj: ClassValidatorPropertyTitle | undefined = storagePropertyTitle.find(o => o.target === object.constructor);
  if (!obj) {
    obj = { target: object.constructor, titles: new Map() };
    storagePropertyTitle.push(obj);
  }
  obj.titles.set(propertyName, title);
}

export function getClassValidatorPropertyTitles(object: object): ClassValidatorPropertyTitle['titles'] {
  const storagePropertyTitle = getClassValidatorPropertyTitlesStorage();
  const obj: ClassValidatorPropertyTitle | undefined = storagePropertyTitle.find(o => o.target === object.constructor);
  if (!obj) {
    return new Map();
  }
  return obj.titles;
}

export function getClassValidatorPropertyTitle(object: object, propertyName: string): string | undefined {
  const titles = getClassValidatorPropertyTitles(object);
  return titles.get(propertyName);
}

// CLASS
export function getClassValidatorTitlesStorage(): ClassValidatorTitle[] {
  const global: { [CLASS_VALIDATOR_TITLES]: ClassValidatorTitle[] } = getGlobal();
  if (!global[CLASS_VALIDATOR_TITLES]) {
    global[CLASS_VALIDATOR_TITLES] = [];
  }
  return global[CLASS_VALIDATOR_TITLES];
}

export function setClassValidatorTitle(object: object, propertyName: string | undefined, title: string) {
  const storageTitle = getClassValidatorTitlesStorage();
  let obj: ClassValidatorTitle | undefined = storageTitle.find(o => o.target === object);
  if (!obj) {
    obj = { target: object, titles: new Map() };
    storageTitle.push(obj);
  }

  obj.titles.set(propertyName || CLASS_VALIDATOR_ROOT_TITLE, title);
}

export function getClassValidatorTitles(object: object): ClassValidatorTitle['titles'] {
  const storageTitle = getClassValidatorTitlesStorage();
  const obj: ClassValidatorTitle | undefined = storageTitle.find(o => o.target === object.constructor);
  if (!obj) {
    return new Map();
  }
  return obj.titles;
}

export function getClassValidatorTitle(object: object, propertyName: string | symbol | undefined): string | undefined {
  const titles = getClassValidatorTitles(object);
  return titles.get(propertyName || CLASS_VALIDATOR_ROOT_TITLE);
}
