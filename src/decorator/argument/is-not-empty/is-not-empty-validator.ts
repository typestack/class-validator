export function IsNotEmptyValidate(
    methodName: string,
    argumentIndex: number,
    argumentValue: any
) {
    if (argumentValue === '' || argumentValue === null || argumentValue === undefined) {
        throw new Error(`Invalid empty argument at index ${argumentIndex} with "${argumentValue}" value in "${methodName}" method`);
    }
}
