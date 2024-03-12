export function IsNotEmptyArgument(target: any, methodName: string, parameterIndex: number) {
  if (!target?.validations) {
    target.validations = [];
  }

  target.validations.push(`${methodName}:${parameterIndex}:${IsNotEmptyArgument.name}`);
}
