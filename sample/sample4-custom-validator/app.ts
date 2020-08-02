import { Validator } from '../../src/validation/Validator';
import { Post } from './Post';

let validator = new Validator();

let post1 = new Post();
post1.title = 'Hello world';

validator.validate(post1).then(result => {
  console.log('1. should not pass: ', result);
});

let post2 = new Post();
post2.title = 'Hello !!!';

validator.validate(post2).then(result => {
  console.log('2. should pass: ', result);
});
