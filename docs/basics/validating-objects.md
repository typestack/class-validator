# Validating objects

```ts
import { validate, IsString, IsInt, IsDate, MaxLength, Min, Max} from "class-validator";

export class Book {

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  author: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsDate()
  publishDate: Date;

}

const book = new Book();
post.title = 'Don Quixote';
post.author = 'Miguel De Cervantes';
post.rating = 11;
post.publishDate = 1615;

validate(book).then(errors => { 
  // errors is an array of ValidationErrors
  if (errors.length > 0) {
    console.warn("validation failed. errors: ", errors);
  }
});
```

Run this example on [Stackblitz](https://stackblitz.com/edit/class-validator-simple-example)