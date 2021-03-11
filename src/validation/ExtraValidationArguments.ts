/**
 * Extra validation arguments that can be passed from caller of validate() to message builders.
 *
 * This type can be augmented using type merging to pass arguments in typesafe way, e.g.
 * ```typescript
 * declare module 'class-validator' {
 *   interface ExtraValidationArguments {
 *     t: TFunction;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExtraValidationArguments {
  // for augmentation with type merging
}
