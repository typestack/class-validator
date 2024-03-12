import { ValidateArguments } from "../../src/decorator/argument";
import { IsNotEmptyArgument } from "../../src/decorator/argument/is-not-empty";

describe('decorator for validating method arguments', () => {
  class MyClass {
    @ValidateArguments
    testMethod(@IsNotEmptyArgument test: string, emptyArgument?: string): void {
        const someVariable = `${test}`;
    }
  }

  it("IsNotEmpty should throw if argument is empty (null, undefined or an empty string)", () => {
    const instance = new MyClass();

    expect(() => instance.testMethod("")).toThrow();
    expect(() => instance.testMethod(null)).toThrow();
    expect(() => instance.testMethod(undefined)).toThrow();
    expect(() => instance.testMethod("test", undefined)).not.toThrow();
  });
});
