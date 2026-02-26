import { ValidationError } from '../validation/ValidationError';
import { StandardSchemaV1 } from './StandardSchema';

export function validationErrorToIssues(valError: ValidationError): StandardSchemaV1.Issue[] {
  const results: StandardSchemaV1.Issue[] = [];
  const errorsToConvert: { path: string[]; value: ValidationError }[] = [{ path: [], value: valError }];

  while (errorsToConvert.length > 0) {
    // this is safe, since we check the length of the array before
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const error = errorsToConvert.pop()!;

    const newPath = [...error.path, error.value.property];

    Object.values(error.value.constraints ?? {}).forEach(constraintMessage =>
      results.push({
        message: constraintMessage,
        path: newPath,
      })
    );

    error.value.children?.reverse().forEach(childError =>
      errorsToConvert.push({
        path: newPath,
        value: childError,
      })
    );
  }

  return results;
}
