# Add IsUserName Validator

## Summary

This PR adds a new `@IsUserName` decorator for validating usernames and human-readable names that may contain special characters like hyphens and apostrophes.

## Features

- ✅ Validates usernames with Unicode support for internationalization
- ✅ Allows letters, numbers, spaces, hyphens (-), and apostrophes (') by default
- ✅ Configurable additional allowed characters via `IsUserNameOptions`
- ✅ Properly escapes special regex characters in custom allowed characters
- ✅ Comprehensive test coverage
- ✅ Usage examples included

## Use Cases

This validator is perfect for validating:
- User full names (e.g., "Mary-Jane O'Brien", "José María")
- Display names
- Human-readable identifiers that may contain hyphens or apostrophes

## Usage Examples

### Basic Usage

```typescript
import { IsUserName } from 'class-validator';

class User {
  @IsUserName()
  fullName: string; // Valid: "John O'Brien", "Mary-Jane", "José María"
}
```

### With Custom Allowed Characters

```typescript
import { IsUserName } from 'class-validator';

class User {
  @IsUserName({ allowedCharacters: '.,' })
  displayName: string; // Valid: "Dr. Smith, Jr."
}
```

### With Custom Error Message

```typescript
import { IsUserName } from 'class-validator';

class User {
  @IsUserName(
    undefined,
    { message: 'Invalid username format' }
  )
  username: string;
}
```

## Implementation Details

- Uses Unicode property escapes (`\p{L}` for letters, `\p{N}` for numbers) for better internationalization support
- Escapes special regex characters in user-provided `allowedCharacters` to prevent regex injection
- Follows the same patterns as other validators in the project

## Files Changed

### Added
- `src/decorator/string/IsUserName.ts` - Main validator implementation
- `src/decorator/string/IsUserName.spec.ts` - Comprehensive test suite
- `sample/sample10-username-validation/User.ts` - Usage example
- `sample/sample10-username-validation/app.ts` - Example application

### Modified
- `src/decorator/decorators.ts` - Added export for `IsUserName`
- `README.md` - Added documentation to validation decorators table
- `CHANGELOG.md` - Added entry for new feature

## Testing

All tests pass. The test suite includes:
- ✅ Valid usernames with default allowed characters
- ✅ Invalid usernames with special characters
- ✅ Custom allowed characters
- ✅ Edge cases (empty strings, non-string values, unicode characters)
- ✅ Very long names

## Breaking Changes

None. This is a new feature addition.

## Checklist

- [x] Code follows the project's style guidelines
- [x] Tests added/updated and passing
- [x] Documentation updated
- [x] CHANGELOG updated
- [x] No breaking changes
- [x] Examples provided

