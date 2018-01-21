import * as _ from "lodash";
import {getFromContainer} from "../../container";
import {validate} from "../../index";
import {MetadataStorage} from "../../metadata/MetadataStorage";
import {ValidationMetadata} from "../../metadata/ValidationMetadata";
import {IsString, MaxLength, IsNumber, Max, IsEmail, IsOptional} from "../decorators";
import InheritValidation from "./inherit-validation";

/**
 * Used as a base for validation, in order for partial classes
 * to pick validation metadatas, property by property.
 */
class Dto {
  @IsNumber()
  @Max(999)
  readonly id: number;

  @IsString()
  @MaxLength(10)
  readonly name: number;

  @IsEmail()
  @IsOptional()
  readonly email: string;
}
const validationsCount = 6;

describe("@InheritValidation", () => {
  let dtoMetaDatas: ValidationMetadata[];

  beforeEach(() => {
    dtoMetaDatas = getMetadatasFrom(Dto);
    expect(dtoMetaDatas).toHaveLength(validationsCount);
  });

  it("does not modify metadatas of the source class", () => {
    const dtoMetadatasNow = getMetadatasFrom(Dto);
    expect(dtoMetaDatas).toEqual(dtoMetadatasNow);
  });

  it("does a deep copy of validation metadatas", () => {
    class SubDto {
      @InheritValidation(Dto, "name")
      readonly name: string;
    }

    const dtoMetadatas = getMetadatasFrom(Dto, "name");
    const subMetadatas = getMetadatasFrom(SubDto, "name");
    const areEqual = areMetadatasEqual(
      [dtoMetadatas, subMetadatas],
      // `propertyName` did not change ("name" => "name"), but `target` did: remove it
      ["target"],
    );
    // with `target` removed, this is a perfect copy
    expect(areEqual).toBe(true);
  });

  it("uses destination property name as a source property name if none is given", () => {
    class SubDto {
      @InheritValidation(Dto)
      readonly name: string;
    }

    const dtoMetadatas = getMetadatasFrom(Dto, "name");
    const subMetadatas = getMetadatasFrom(SubDto, "name");
    const areEqual = areMetadatasEqual(
      [dtoMetadatas, subMetadatas],
      ["target"],
    );
    expect(areEqual).toBe(true);
  });

  it("allows inheriting validation metadatas with a different property name", () => {
    class SubDto {
      @InheritValidation(Dto, "name")
      readonly nickname: string;
    }

    const dtoMetadatas = getMetadatasFrom(Dto, "name");
    const subMetadatas = getMetadatasFrom(SubDto, "nickname");
    const areEqual = areMetadatasEqual(
      [dtoMetadatas, subMetadatas],
      // `propertyName` and `target` changed: remove them before checking equality
      ["propertyName", "target"],
    );
    expect(areEqual).toBe(true);
  });

  it("can be used on multiple properties", () => {
    class SubDto {
      @InheritValidation(Dto)
      readonly id: number;

      @InheritValidation(Dto)
      readonly name: string;
    }

    const dtoMetadatas = _.concat(
      // only get metadatas from fields used by SubDto
      getMetadatasFrom(Dto, "id"),
      getMetadatasFrom(Dto, "name"),
    );
    const subMetadatas = getMetadatasFrom(SubDto);
    const areEqual = areMetadatasEqual(
      [dtoMetadatas, subMetadatas],
      ["target"],
    );
    expect(areEqual).toBe(true);
  });

  it("uses the inherited metadatas for objects validation", async () => {
    class SubDto {
      constructor(name: string) {
        this.name = name;
      }

      @InheritValidation(Dto)
      readonly name: string;
    }

    const validSubDto = new SubDto("Mike");
    expect(await validate(validSubDto)).toHaveLength(0);

    const invalidSubDto = new SubDto("way_too_long_name");
    const errors = await validate(invalidSubDto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty("maxLength");
  });
});

/**
 * Use `class-validator`"s `MetadataStorage` to get the `ValidationMetadata`s
 * of a given class, or (more specific) one of its property.
 *
 * @param fromClass Class to get `ValidationMetadata`s from.
 * @param property  Source property (if none is given, get metadatas from all properties).
 *
 * @return {ValidationMetadata[]} Target metadatas.
 */
function getMetadatasFrom(
  fromClass: new () => object,
  property?: string,
): ValidationMetadata[] {
  const metadataStorage = getFromContainer(MetadataStorage);
  const metadatas = _.cloneDeep(metadataStorage.getTargetValidationMetadatas(
    fromClass,
    undefined,
  ));

  if (!property) {
    return metadatas;
  }

  return metadatas.filter((vm) => vm.propertyName === property);
}

/**
 * Determine whether two collections of `ValidationMetadata`s are
 * the same, eventually after having removed a few fields (which are
 * known to have been changed by design).
 *
 * @param metaDataCollections Array of 2 `ValidationMetadata[]` to be compared.
 * @param withoutFields       Fields to be removed from the metadatas before comparing them.
 *
 * @return {boolean} `true` if both collections are equal.
 */
function areMetadatasEqual(
  metaDataCollections: ValidationMetadata[][],
  withoutFields: string[],
): boolean {
  if (metaDataCollections.length !== 2) {
    throw new TypeError("Misuse of metadatasAreEqual");
  }

  _.each(withoutFields, (field) => {
    _.each(metaDataCollections, (metadatas) => {
      _.each(metadatas, (md) => _.unset(md, field));
    });
  });

  return _.isEqual(metaDataCollections[0], metaDataCollections[1]);
}
