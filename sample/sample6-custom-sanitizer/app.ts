import {Validator} from "../../src/Validator";
import {Post} from "./Post";

let validator = new Validator();

let post1 = new Post();
post1.title = "Hello world";
validator.sanitize(post1);
console.log(post1);