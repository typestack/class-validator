import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, validate, ValidationError } from 'class-validator'

/** Validates an object without the oversight of global validation such as whitelist
 * - Only provides 1 message per invalid item
 * - FUTURE TODO: Options should be allowed to define such sub options
 *   - Aka the argument of type class-validator.ValidatorOptions should work here
*/
@ValidatorConstraint({ name: 'validateNoGlobals', async: true })
export class ValidateNoGlobals implements ValidatorConstraintInterface {
  lastErrors: ValidationError[] = []

  async validate(value: Record<any, string>, args: ValidationArguments): Promise<boolean> {
    this.lastErrors = await validate(value, args.object)
    return !this.lastErrors.length
  }

  defaultMessage(args: ValidationArguments): string {
    // loop all errors, get messages with scoped context for proper display
    const messages = this.lastErrors.reduce((all: string[], error) => {
      if(!error.constraints) {
        return all
      }

      const messageObject = Object.values(error.constraints)
      // add dot notation scoping context for proper display
      const scopedMessages = messageObject.map(x => `${args.property}.${x}`)
      all.push(...scopedMessages)
      return all
    },[])

    // can only return 1 string message
    return messages[0] || `${args.property} has an invalid value`
  }
}