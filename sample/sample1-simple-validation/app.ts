import {Validator} from "../../src/Validator";
import {Post} from "./Post";

let validator = new Validator();

// Sample1. simple validation

let post1 = new Post();
post1.title = 'Hello world'; // should pass
post1.text = 'this is a great post about hello world'; // should pass
post1.rating = 10; // should pass
post1.email = 'info@google.com'; // should pass
post1.site = 'google.com'; // should pass
post1.createDate = new Date(); // should pass

console.log(validator.validate(Post, post1)); // should pass completely, e.g. return empty array

let post2 = new Post();
post2.title = 'Hello'; // should not pass
post2.text = 'this is a great post about hell world'; // should not pass
post2.rating = 11; // should not pass
post2.email = 'google.com'; // should not pass
post2.site = 'googlecom'; // should not pass
// should not pass because date property is missing

console.log(validator.validate(Post, post2)); // should not pass completely, must return array of ValidationError-s

// Sample2. using validation options to skip properties that are not defined

let post3 = new Post();
post3.title = 'Hello'; // should not pass
post3.text = 'this is a great post about hell world'; // should not pass
post3.rating = 11; // should not pass
post3.email = 'google.com'; // should not pass
post3.site = 'googlecom'; // should not pass

console.log(validator.validate(Post, post3, { skipMissingProperties: true })); // should not pass, but returned ValidationError-s should not have error about date field

let post4 = new Post();
post4.title = 'Hello world'; // should pass
post4.text = 'this is a great post about hello world'; // should pass
post4.rating = 10; // should pass
post4.email = 'info@google.com'; // should pass
post4.site = 'google.com'; // should pass

console.log(validator.validate(Post, post4, { skipMissingProperties: true })); // should pass even if date is not set

// Sample3. using validation groups

let post5 = new Post();
post5.title = 'Hello world'; // should pass
post5.text = 'this is a great post about hello world'; // should pass
post5.rating = 10; // should pass
post5.email = 'info@google.com'; // should pass
post5.site = 'google.com'; // should pass

console.log(validator.validate(Post, post5, { skipMissingProperties: true })); // should pass even if date is not set