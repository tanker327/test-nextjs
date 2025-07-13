# Convertor

A TypeScript library for migrating grid view configurations from old format to new format, with comprehensive column ID mapping and ag-grid filter model support.

## Dependencies

This library uses minimal, production-ready dependencies:

```json
{
  "dependencies": {
    "ag-grid-react": "32.0.2",
    "zod": "^3.23.8"
  }
}
```

## Installation

```bash
npm install
npm run build
```

## Usage

### Converting Single Configuration

```typescript
import { convertOldConfigToNewConfig, GridConfig } from './dist';

const oldConfig: GridConfig = {
  // ... your old grid configuration
};

const newConfig = convertOldConfigToNewConfig(oldConfig);
```

### Converting Multiple Configurations

```typescript
import { convertOldConfigArrayToNewConfigArray, GridConfigArray } from './dist';

const oldConfigs: GridConfigArray = [
  // ... array of old grid configurations
];

const newConfigs = convertOldConfigArrayToNewConfigArray(oldConfigs);
```

### Schema Validation

```typescript
import { GridConfigArraySchema, ViewConfigSchema } from './dist';

// Validate input data
const inputResult = GridConfigArraySchema.safeParse(data);
if (inputResult.success) {
  const validatedInput = inputResult.data;
  // ... proceed with migration
}

// Validate output data
const outputResult = ViewConfigSchema.safeParse(migratedConfig);
if (outputResult.success) {
  const validatedOutput = outputResult.data;
  // ... use validated config
}
```

## Scripts

- `npm start` - Run the migration script on sample data
- `npm run build` - Build the library using TypeScript compiler
- `npm run dev` - Build in watch mode
- `npm test` - Run tests with Jest
- `npm run test:coverage` - Run tests with coverage report

## Features

- ✅ **Column ID Migration**: Automatically maps old column IDs to new format
- ✅ **Filter Model Migration**: Preserves ag-grid filter configurations
- ✅ **Type Safety**: Full TypeScript support with Zod validation
- ✅ **Comprehensive Testing**: 123+ tests covering all migration scenarios
- ✅ **Production Ready**: Uses only essential dependencies

## Migration Features

### Column ID Mapping
- `name` → `title`
- `ragStatus` → `rag`
- `sponsors` → `sponsor`
- Financial fields moved to namespaced structure (`totalCost` → `financials.live2025`)
- Lead roles changed from plural to singular
- Organization field naming simplified

### Filter Model Support
- Text filters (simple and combined)
- Number filters (simple and combined)
- Date filters (simple and combined)
- Set filters
- Multi filters
- Preserves all ag-grid filter configurations

### Grid State Migration
- Migrates column state with new column IDs
- Preserves column widths, sorting, hiding, pinning
- Migrates filter models with updated column references
- Includes Phoenix-specific grid properties (density, theme, etc.)

## Type Definitions

The library provides complete TypeScript definitions for all exported functions and types, enabling full IntelliSense support in your IDE.