import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from '../../src';

export class Post {
  @Length(10, 20)
  title!: string;

  @Contains('hello', {
    transformKey: 'customContainsKey', //pass transformKey to be passed to handle special cases
  })
  text!: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating!: number;

  @IsEmail()
  email!: string;

  @IsFQDN()
  site!: string;

  @IsDate()
  createDate!: Date;
}

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

validate(post, {
  validationError: {
    //pass a transform function to overwrite the default implemention for this validation only
    transformFunction: (key: string) => `I was called with ${key}`,
  },
}).then((errors) => {
  // errors is an array of validation errors
  if (errors.length > 0) {
    console.log('validation failed. errors: ', errors);
  } else {
    console.log('validation succeed');
  }
});

validateOrReject(post, {
  validationError: {
    //pass a transform function to overwrite the default implemention for this validation only
    transformFunction: (key: string) => `I was called with ${key}`,
  },
}).catch((errors) => {
  console.log('Promise rejected (validation failed). Errors: ', errors);
});
// or
async function validateOrRejectExample(input: any) {
  try {
    await validateOrReject(input, {
      validationError: {
        //pass a transform function to overwrite the default implemention for this validation only
        transformFunction: (key: string) => `I was called with ${key}`,
      },
    });
  } catch (errors) {
    console.log(
      'Caught promise rejection (validation failed). Errors: ',
      errors
    );
  }
}
