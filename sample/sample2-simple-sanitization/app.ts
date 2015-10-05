import {Validator} from "../../src/Validator";
import {Post} from "./Post";

let validator = new Validator();

// Sample1. simple sanitization

let post1 = new Post();
post1.title = ' Hello world '; // should pass
post1.text = '1. this is a great (2) post about hello 3 world.'; // should pass
post1.rating = 12.2; // should pass

validator.sanitize(Post, post1);
console.log(post1);