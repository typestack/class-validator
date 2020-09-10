import { setClassValidatorPropertyTitle, setClassValidatorTitle } from './titles.storage';

export function ClassPropertyTitle(title: string): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    setClassValidatorPropertyTitle(object, propertyName, title);
  };
}

export function ClassTitle(title: string, key?: string): ClassDecorator {
  return function (object: object): void {
    setClassValidatorTitle(object, key, title);
  };
}
