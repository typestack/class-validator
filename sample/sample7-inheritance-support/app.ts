import { validate } from '../../src/index';
import { Post } from './Post';

// Sample1. simple validation

let post1 = new Post();
post1.title = 'Hello world'; // should pass
post1.text = 'this is a great post about hello world'; // should pass
post1.rating = 10; // should pass
post1.email = '@google.com'; // should not pass

validate(post1).then(result => {
  console.log('1. should not pass: ', result); // should not pass completely
});
