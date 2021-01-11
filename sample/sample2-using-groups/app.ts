import { Validator } from '../../src/validation/Validator';
import { Post } from './Post';

let validator = new Validator();

let post1 = new Post();
post1.title = 'Hello world'; // should pass
post1.text = 'this is a great post about hello world'; // should pass
post1.rating = 10; // should pass
post1.email = 'info@google.com'; // should pass
post1.site = 'google.com'; // should pass
post1.createDate = new Date(); // should pass

validator.validate(post1, { groups: ['users'] }).then(result => {
  console.log('1.1. should pass: ', result);
});

validator.validate(post1, { groups: ['admins'] }).then(result => {
  console.log('1.2. should pass: ', result);
});

let post2 = new Post();
post2.title = 'Hi!'; // should not pass for user or moderator, but should pass for admin
post2.text = 'this is a great post about hello world'; // should pass
post2.rating = 10; // should pass
post2.email = 'info@google.com'; // should pass
post2.site = 'google.com'; // should pass
post2.createDate = new Date(); // should pass

validator.validate(post2, { groups: ['users'] }).then(result => {
  console.log('2.1. should not pass: ', result);
});

validator.validate(post2, { groups: ['moderators'] }).then(result => {
  console.log('2.2. should not pass: ', result);
});

validator.validate(post2, { groups: ['admins'] }).then(result => {
  console.log('2.3. should pass: ', result);
});

validator.validate(post2, { groups: ['users', 'admins'] }).then(result => {
  console.log('2.4. should not pass: ', result);
});

let post3 = new Post();
post3.title = 'Hello world'; // should not pass for user or moderator, but should pass for admin
post3.text = 'this is a great post about hello world'; // should pass
post3.rating = 10; // should pass
post3.email = 'info@google.com'; // should pass
post3.site = 'google.com'; // should pass
// note that we dont set date

validator.validate(post3, { groups: ['users'] }).then(result => {
  console.log('3.1. should pass: ', result);
});

validator.validate(post3).then(result => {
  console.log('3.2. should not pass: ', result);
});

let post4 = new Post();
post4.title = 'Hello world'; // should not pass for user or moderator, but should pass for admin
post4.text = 'this is a great post about hello world'; // should pass
post4.rating = 10; // should pass
post4.email = ''; // should not pass
post4.site = 'google.com'; // should pass
// note that we dont set date

validator.validate(post4, { groups: ['users'] }).then(result => {
  console.log('4.1. should not pass: ', result);
});

validator.validate(post4).then(result => {
  console.log('4.2. should not pass: ', result);
});
