import {validate, ValidationError} from "../../src/index";
import {Post, PostType} from "./Post";

// Sample8. automatic validation

let post1 = new Post();
post1.title = "Hello world"; // should pass
post1.text = "this is a great post about hello world"; // should pass
post1.rating = 10; // should pass
post1.email = "info@google.com"; // should pass
post1.site = "google.com"; // should pass
post1.createDate = new Date(); // should pass
post1.tags = ["abcd1", "abcd2", "abcd3", "abcd4", "abcd4"]; // should pass
post1.type = PostType.Private;


let post2 = new Post();

try {
    post2.title = "Hello"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (!(error instanceof ValidationError)) {
        throw error;
    }
}
try {
    post2.text = "this is a great post about hell world"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (!(error instanceof ValidationError)) {
        throw error;
    }
}
try {
    post2.rating = 1.1; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (!(error instanceof ValidationError)) {
        throw error;
    }
}
try {
    post2.email = "google.com"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (!(error instanceof ValidationError)) {
        throw error;
    }
}
try {
    post2.site = "googlecom"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (!(error instanceof ValidationError)) {
        throw error;
    }
}
