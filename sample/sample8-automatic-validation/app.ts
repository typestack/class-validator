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
console.log("Created post1 successfully");


let post2 = new Post();
const post2errors = [];
try {
    post2.title = "Hello"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}
try {
    post2.text = "this is a great post about hell world"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}
try {
    post2.rating = 1.1; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}
try {
    post2.email = "google.com"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}
try {
    post2.site = "googlecom"; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}

try {
    post2.createDate = undefined; // should not pass
    throw new Error("Assignment should not pass");
} catch (error) {
    if (error instanceof ValidationError) {
        post2errors.push(error);
    } else {
        throw error;
    }
}

console.log("Post 2 successfully got validation errors", post2errors);


let post3 = new Post();
Object.assign(post3, {
    title: "Hello world",
    text: "this is a great post about hello world",
    rating: 10,
    email: "info@google.com",
    site: "google.com",
    createDate: new Date(),
    tags: ["abcd1", "abcd2", "abcd3", "abcd4", "abcd4"],
    type: PostType.Private,
});

console.log("Created post3 successfully");


let post4 = new Post();
try {
    // Should fail on the first attempted property assignment
    Object.assign(post4, {
        title: "Hello",
        text: "this is a great post about hell world",
        rating: 1.1,
        email: "google.com",
        site: "googlecom",
        createDate: undefined,
        tags: ["JS"]
    });
} catch (error) {
    console.log("Post 4 successfully got validation errors", error);
}
