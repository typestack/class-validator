export function isObjectLiteral(v: any): v is Record<keyof any, any> | any {
  return !!v && v.constructor === Object;
}
