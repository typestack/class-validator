/**
 * Contains necessary information to present good error messages to the user
 */
export class ExtendedMessage {
    constructor(
        public readonly type: string,
        public readonly message: string,
        public readonly args: any[]
    ) {
        // nop
    }
}