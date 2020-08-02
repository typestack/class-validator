import { Validator } from '../../src/validation/Validator';
import { User } from './User';

let validator = new Validator();

let user1 = new User();
user1.firstName = 'Umed';

validator.validate(user1, { skipMissingProperties: true }).then(result => {
  console.log('1. should pass: ', result);
});

let user2 = new User();
user2.firstName = 'admin';

validator.validate(user2, { skipMissingProperties: true }).then(result => {
  console.log('2. should not pass: ', result);
});

let user3 = new User();
user3.firstName = 'user';

validator.validate(user3, { skipMissingProperties: true }).then(result => {
  console.log('3. should not pass: ', result);
});

let user4 = new User();
user4.firstName = 'Zak';
user4.lastName = 'Henry';

validator.validate(user4).then(result => {
  console.log('4. should pass: ', result);
});

let user5 = new User();
user5.firstName = 'Henry';
user5.lastName = 'Zak';

validator.validate(user5).then(result => {
  console.log('5. should not pass: ', result);
});
