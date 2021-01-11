# Validating objects

```ts
import {
  validate,
  validateOrReject,
  IsString,
  IsInt,
  IsDate,
  MaxLength,
  Min,
  Max,
  ValidationError,
} from 'class-validator';

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
book.title = 'Don Quixote';
book.author = 'Miguel De Cervantes';
book.rating = 11;
book.publishDate = new Date();

validate(book).then((errors: ValidationError[]) => {
  if (errors.length > 0) {
    console.warn('validate() - Validation failed. Errors: ', errors);
  }
});

validateOrReject(book).catch((errors: ValidationError[]) => {
  console.warn('validateOrReject() - Validation failed. Errors: ', errors);
});

awaitExample();

async function awaitExample() {
  try {
    await validateOrReject(book);
  } catch (errors) {
    console.warn('Async validateOrReject() - Validation failed. Errors: ', errors);
  }
}
```

Run this example on [Stackblitz](https://stackblitz.com/edit/class-validator-simple-example-u9h1ve?file=index.ts)
