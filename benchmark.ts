import 'reflect-metadata';
import { validate, IsString, IsInt, IsBoolean, IsEmail, IsOptional, MinLength, MaxLength, Min, Max, IsNotEmpty, ValidateNested } from './src';

// --- Classes with inheritance and nesting ---
class BaseEntity {
  @IsString()
  id!: string;

  @IsString()
  @MinLength(1)
  createdBy!: string;
}

class Address {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  zip!: string;
}

class User extends BaseEntity {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age!: number;

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsString()
  website?: string;

  @ValidateNested()
  address!: Address;
}

// --- Benchmark helpers ---

function createValidUser(): User {
  const user = new User();
  user.id = 'abc-123';
  user.createdBy = 'system';
  user.firstName = 'John';
  user.lastName = 'Doe';
  user.email = 'john@example.com';
  user.age = 30;
  user.isActive = true;
  user.nickname = 'johnd';
  user.bio = 'A developer';
  user.phone = '555-1234';
  user.score = 100;
  user.website = 'https://example.com';
  const address = new Address();
  address.street = '123 Main St';
  address.city = 'Springfield';
  address.zip = '62704';
  user.address = address;
  return user;
}

async function bench(label: string, iterations: number, fn: () => Promise<void>): Promise<void> {
  // Warmup
  for (let i = 0; i < 100; i++) await fn();

  const start = performance.now();
  for (let i = 0; i < iterations; i++) await fn();
  const elapsed = performance.now() - start;

  const opsPerSec = Math.round((iterations / elapsed) * 1000);
  console.log(`${label}: ${iterations} iterations in ${elapsed.toFixed(1)}ms (${opsPerSec.toLocaleString()} ops/sec)`);
}

async function main(): Promise<void> {
  const iterations = 10_000;
  const user = createValidUser();

  console.log('class-validator benchmark');
  console.log('========================\n');

  await bench('Valid object (13 props, inheritance + nested)', iterations, async () => {
    await validate(user);
  });

  const invalidUser = createValidUser();
  invalidUser.email = 'not-an-email';
  invalidUser.age = -5;
  invalidUser.firstName = 'X';

  await bench('Invalid object (3 errors)', iterations, async () => {
    await validate(invalidUser);
  });

  await bench('Valid object with groups', iterations, async () => {
    await validate(user, { groups: ['admin', 'user'] });
  });

  await bench('Valid object with strictGroups', iterations, async () => {
    await validate(user, { strictGroups: true });
  });
}

main().catch(console.error);
