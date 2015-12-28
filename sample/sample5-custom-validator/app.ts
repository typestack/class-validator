import {Validator} from "../../src/Validator";
import {Post} from "./Post";

let validator = new Validator();

let post1 = new Post();
post1.title = "Hello world";

console.log("should not pass: ", validator.validate(post1)); // should not pass


let post2 = new Post();
post2.title = "Hello !!!";

console.log("should pass: ", validator.validate(post2)); // should pass

