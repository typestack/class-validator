import * as ansicolor from "ansicolor";

import { ValidationError } from "../validation/ValidationError";

export function printError(error: ValidationError): void {
  if (typeof window !== "undefined") {
    console.log(...ansicolor.default.parse(error.toString(true)).asChromeConsoleLogArguments);
  } else {
    console.log(error.toString(true));
  }
}