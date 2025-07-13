# Testing Configuration

This document outlines the comprehensive testing setup for the convertor library.

## Test Framework

- **Jest** - Modern JavaScript testing framework
- **ts-jest** - TypeScript preprocessor for Jest
- **@jest/globals** - Jest globals for TypeScript

## Test Structure

```
src/
├── *.test.ts       # Unit tests for each module
└── main.ts         # Demo file (excluded from coverage)

tests/
├── integration.test.ts  # Integration tests
└── setup.ts            # Global test setup (if needed)
```

## Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI (no watch mode)
npm run test:ci

# Run only integration tests
npm run test:integration

# Run only unit tests
npm run test:unit
```

## Coverage Configuration

- **Minimum Coverage**: 75% for statements, branches, functions, and lines
- **Coverage Directory**: `./coverage`
- **Coverage Formats**: text, lcov, html, json
- **Excluded Files**: 
  - `src/main.ts` (demo file)
  - Test files themselves
  - TypeScript declaration files

## Test Categories

### Unit Tests
- **schemas.test.ts**: Tests for Zod schema definitions
- **validators.test.ts**: Tests for validation utility functions
- **types.test.ts**: Tests for TypeScript type definitions

### Integration Tests
- **integration.test.ts**: End-to-end workflow tests
- Tests complete user/product/order validation workflows
- Performance tests
- Edge case handling
- Error handling scenarios

## Test Features

### Comprehensive Validation Testing
- Valid data scenarios
- Invalid data scenarios
- Edge cases (min/max values)
- Type safety validation
- Error message validation

### Performance Testing
- Bulk validation performance tests
- Memory usage validation

### Error Handling
- Multiple validation errors
- Detailed error message testing
- Custom error types

### Type Safety
- TypeScript type guard testing
- Type inference validation
- Generic type testing

## CI/CD Integration

### GitHub Actions
- Automated testing on Node.js 18.x, 20.x, 22.x
- Coverage reporting
- Lint checks
- Build verification

### Coverage Reporting
- Codecov integration for coverage tracking
- Coverage badges in README
- Coverage thresholds enforced in CI

## Best Practices

1. **Test Organization**: Each module has its own test file
2. **Descriptive Names**: Test names clearly describe what is being tested
3. **Arrange-Act-Assert**: Tests follow AAA pattern
4. **Edge Cases**: Tests include boundary values and error conditions
5. **Type Safety**: Tests verify TypeScript type correctness
6. **Coverage**: Aim for high coverage while maintaining test quality

## Running Tests Locally

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. View coverage: `npm run test:coverage`
4. Open coverage report: `open coverage/lcov-report/index.html`

## Debugging Tests

- Use `npm run test:watch` for interactive development
- Add `console.log` statements for debugging (remember to remove them)
- Use Jest's `--verbose` flag for detailed output
- Use `--testNamePattern` to run specific tests