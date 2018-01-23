import * as _ from "lodash";
import {getFromContainer} from "../../container";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";

/**
 * Allow copying validation metadatas set by `class-validator` from
 * a given Class property to an other. Copied `ValidationMetadata`s
 * will have their `target` and `propertyName` changed according to
 * the decorated class and property.
 *
 * @param fromClass    Class to inherit validation metadatas from.
 * @param fromProperty Name of the target property (default to decorated property).
 *
 * @return {PropertyDecorator} Responsible for copying and registering `ValidationMetada`s.
 *
 * @example
 * class SubDto {
 *   @InheritValidation(Dto)
 *   readonly id: number;
 *
 *   @InheritValidation(Dto, 'name')
 *   readonly firstName: string;
 *
 *   @InheritValidation(Dto, 'name')
 *   readonly lastName: string;
 * }
 */
function InheritValidation(
    fromClass: new () => object,
    fromProperty?: string,
): PropertyDecorator {
  const metadataStorage = getFromContainer(MetadataStorage);
  const validationMetadatas = metadataStorage.getTargetValidationMetadatas(
      fromClass,
      typeof fromClass,
  );

  /**
   * Change the `target` and `propertyName` of each `ValidationMetaData`
   * and add it to `MetadataStorage`. Thus, `class-validator` uses it
   * during validation.
   *
   * @param toClass    Class owning the decorated property.
   * @param toProperty Name of the decorated property.
   */
  return (toClass: object, toProperty: string | symbol) => {
    const toPropertyName: string = toProperty instanceof Symbol ?
      typeof toProperty :
      toProperty;

    const sourceProperty = fromProperty || toProperty;

    const metadatasCopy = _.cloneDeep(
        validationMetadatas.filter((vm) =>
            vm.target === fromClass &&
            vm.propertyName === sourceProperty,
        ),
    );

    metadatasCopy.forEach((vm: ValidationMetadata) => {
        vm.target = toClass.constructor;
        vm.propertyName = toPropertyName;
        metadataStorage.addValidationMetadata(vm);
    });
  };
}

export default InheritValidation;
