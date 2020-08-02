import { Validator } from '../../src/validation/Validator';
import { Post } from './Post';
import { Tag } from './Tag';

let validator = new Validator();

let tag1 = new Tag();
tag1.value = 'ja';

let tag2 = new Tag();
tag2.value = 'node.js';

let post1 = new Post();
post1.title = 'Hello world';
post1.tags = new Set();
post1.tags.add(tag1);
post1.tags.add(tag2);

validator.validate(post1).then(result => {
  console.log('1. should not pass: ', result);
});
