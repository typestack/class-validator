import { IsNotEmptyArgument } from "./is-not-empty";
import { IsNotEmptyValidate } from "./is-not-empty/is-not-empty-validator";

export function ValidateArguments(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value!;

    descriptor.value = function (...args: Array<any>) {
        if (target?.validations?.length) {
            for (const validation of target.validations) {
                const [methodName, argumentIndex, validatorName] = validation.split(":");

                if (method.name === methodName) {
                    switch (validatorName) {
                        case IsNotEmptyArgument.name:
                            const argumentValue = args[argumentIndex];

                            IsNotEmptyValidate(methodName, argumentIndex, argumentValue);

                            break;
                    }
                }
            }
        }

        return method.apply(this, arguments);
    };
}
