# Convertor

A TypeScript library with Zod validation for data conversion and validation.

## Installation

```bash
npm install convertor
```

## Usage

```typescript
import { UserSchema, validate } from 'convertor';

const userData = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30,
};

const user = validate(UserSchema, userData);
console.log(user);
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run in watch mode
npm run dev

# Lint the code
npm run lint

# Format the code
npm run format
```

## Available Schemas

- `UserSchema` - Validates user data
- `ProductSchema` - Validates product data
- `OrderSchema` - Validates order data

## Validation Functions

- `validate()` - Validates data and throws on error
- `validateSafe()` - Returns a result object with success/error
- `isValid()` - Type guard function that returns boolean