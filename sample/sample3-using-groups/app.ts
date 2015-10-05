import {Validator} from "../../src/Validator";
import {Post} from "./Post";

let validator = new Validator();

let post1 = new Post();
post1.title = 'Hello world'; // should pass
post1.text = 'this is a great post about hello world'; // should pass
post1.rating = 10; // should pass
post1.email = 'info@google.com'; // should pass
post1.site = 'google.com'; // should pass
post1.createDate = new Date(); // should pass

console.log('should pass: ', validator.validate(Post, post1, {
    groups: ['users']
}));

console.log('should pass: ', validator.validate(Post, post1, {
    groups: ['admins']
}));

let post2 = new Post();
post2.title = 'Hi!'; // should not pass for user or moderator, but should pass for admin
post2.text = 'this is a great post about hello world'; // should pass
post2.rating = 10; // should pass
post2.email = 'info@google.com'; // should pass
post2.site = 'google.com'; // should pass
post2.createDate = new Date(); // should pass

console.log('should not pass: ', validator.validate(Post, post2, {
    groups: ['users']
}));

console.log('should not pass: ', validator.validate(Post, post2, {
    groups: ['moderators']
}));

console.log('should pass: ', validator.validate(Post, post2, {
    groups: ['admins']
}));

console.log('should pass: ', validator.validate(Post, post2, {
    groups: ['users', 'admins']
}));

let post3 = new Post();
post3.title = 'Hello world'; // should not pass for user or moderator, but should pass for admin
post3.text = 'this is a great post about hello world'; // should pass
post3.rating = 10; // should pass
post3.email = 'info@google.com'; // should pass
post3.site = 'google.com'; // should pass
// note that we dont set date

console.log('should pass: ', validator.validate(Post, post3, {
    groups: ['users']
}));

console.log('should not pass: ', validator.validate(Post, post3));

let post4 = new Post();
post4.title = 'Hello world'; // should not pass for user or moderator, but should pass for admin
post4.text = 'this is a great post about hello world'; // should pass
post4.rating = 10; // should pass
post4.email = ''; // should not pass
post4.site = 'google.com'; // should pass
// note that we dont set date

console.log('should not pass: ', validator.validate(Post, post4, {
    groups: ['users']
}));

console.log('should not pass: ', validator.validate(Post, post4));