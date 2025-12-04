import { validate } from '../..';
import { User } from './User';

// Example 1: Valid username with default allowed characters
const user1 = new User();
user1.fullName = "John O'Brien";
user1.email = 'john@example.com';
user1.displayName = 'John Doe, Jr.';
user1.username = "Mary-Jane Watson";

validate(user1).then(errors => {
  if (errors.length > 0) {
    console.log('Validation failed. Errors:', errors);
  } else {
    console.log('Validation succeeded!');
  }
});

// Example 2: Invalid username (contains special character)
const user2 = new User();
user2.fullName = "John@Doe"; // Invalid: contains @
user2.email = 'john@example.com';
user2.displayName = 'John Doe';
user2.username = "Mary-Jane";

validate(user2).then(errors => {
  if (errors.length > 0) {
    console.log('Validation failed. Errors:', errors);
    errors.forEach(error => {
      console.log(`- ${error.property}: ${Object.values(error.constraints || {}).join(', ')}`);
    });
  } else {
    console.log('Validation succeeded!');
  }
});

// Example 3: Valid username with unicode characters
const user3 = new User();
user3.fullName = "José María"; // Valid: unicode letters are supported
user3.email = 'jose@example.com';
user3.displayName = 'José M.';
user3.username = "François";

validate(user3).then(errors => {
  if (errors.length > 0) {
    console.log('Validation failed. Errors:', errors);
  } else {
    console.log('Validation succeeded!');
  }
});

