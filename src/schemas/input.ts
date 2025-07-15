import { z } from 'zod';

// Define filter types as a constant
export const FILTER_TYPES = ['text', 'number', 'date', 'set', 'multi'] as const;
export type FilterType = typeof FILTER_TYPES[number];

// Column setting schema for individual column configuration
export const ColumnSettingSchema = z.object({
  colId: z.string(),
  width: z.number(),
  hide: z.boolean(),
  pinned: z.union([z.literal('left'), z.literal('right'), z.null()]),
  sort: z.union([z.literal('asc'), z.literal('desc'), z.null()]),
  sortIndex: z.union([z.number(), z.null()]),
  aggFunc: z.union([z.string(), z.null()]), // Could be specific enum if we know all possible values
  rowGroup: z.boolean(),
  rowGroupIndex: z.union([z.number(), z.null()]),
  pivot: z.boolean(),
  pivotIndex: z.union([z.number(), z.null()]),
  flex: z.union([z.number(), z.null()]),
});

// Schema for the parsed column_settings JSON array
export const ColumnSettingsArraySchema = z.array(ColumnSettingSchema);

// ✅ RESOLVED: Schema for the parsed filter_settings JSON object based on ag-grid filter examples
// FilterSettings is a map where key is column name/id and value is ISimpleFilter object from ag-grid
// Based on ag-grid official types and real filter examples

// Text and Number filter model
export const TextNumberFilterModelSchema = z.object({
  filterType: z.enum(['text', 'number'] as const).optional(),
  type: z
    .enum([
      'empty',
      'equals',
      'notEqual',
      'lessThan',
      'lessThanOrEqual',
      'greaterThan',
      'greaterThanOrEqual',
      'inRange',
      'contains',
      'notContains',
      'startsWith',
      'endsWith',
      'blank',
      'notBlank',
    ])
    .nullable()
    .optional(),
  filter: z.union([z.string(), z.number()]).nullable().optional(), // Filter value
  filterTo: z.union([z.string(), z.number()]).nullable().optional(), // For range filters
});

// Date filter model (uses dateFrom/dateTo instead of filter/filterTo)
export const DateFilterModelSchema = z.object({
  filterType: z.literal('date').optional(),
  type: z
    .enum([
      'empty',
      'equals',
      'notEqual',
      'lessThan',
      'lessThanOrEqual',
      'greaterThan',
      'greaterThanOrEqual',
      'inRange',
      'blank',
      'notBlank',
    ])
    .nullable()
    .optional(),
  dateFrom: z.string().nullable().optional(), // ISO date string
  dateTo: z.string().nullable().optional(), // For range filters
});

// Set filter model
export const SetFilterModelSchema = z.object({
  filterType: z.literal('set').optional(),
  values: z.array(z.string()), // Selected values
});

// Base simple filter model (union of all simple types)
export const SimpleFilterModelSchema = z.union([
  TextNumberFilterModelSchema,
  DateFilterModelSchema,
  SetFilterModelSchema,
]);

// Combined filter model for complex filters (example: textEqualsSwimmingOrEqualsGymnastics)
// This extends simple filter by adding operator and conditions at the same level
export const CombinedFilterModelSchema = z.object({
  filterType: z.enum(['text', 'number', 'date'] as const),
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(
    z.union([TextNumberFilterModelSchema, DateFilterModelSchema, SetFilterModelSchema]),
  ),
});

// Multi filter model (example: filterModel with filterModels array)
export const MultiFilterModelSchema = z.object({
  filterType: z.literal('multi'),
  filterModels: z.array(z.union([SimpleFilterModelSchema, z.null()])),
});

// Union type for all possible filter models
// Order matters: CombinedFilterModelSchema must come first because it has more specific structure
export const FilterModelSchema = z.union([
  CombinedFilterModelSchema, // Must be first - has operator + conditions
  MultiFilterModelSchema, // Second - has filterModels array
  SimpleFilterModelSchema, // Third - basic filters
  z.any(), // Fallback for other ag-grid filter types
]);

export const FilterSettingsSchema = z.record(z.string(), FilterModelSchema);

// Transform schemas for parsing JSON strings
const parseJsonString = <T>(schema: z.ZodSchema<T>) =>
  z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str);
      return schema.parse(parsed);
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: `Invalid JSON: ${error}`,
      });
      return z.NEVER;
    }
  });

// Main grid configuration schema
export const GridConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner: z.string(),
  scope: z.union([
    z.literal('BelongToMyself'),
    z.literal('All'),
    z.literal('BelongToMyOrg'),
    z.null(),
  ]),
  type: z.enum(['MILESTONE', 'IP_AND_SM']),
  column_settings: z.union([parseJsonString(ColumnSettingsArraySchema), z.null()]),
  filter_settings: z.union([parseJsonString(FilterSettingsSchema), z.null()]),
  quick_search_string: z.union([z.string(), z.null()]),
  favorite: z.boolean(),
  preset: z.boolean(),
  deleted: z.boolean(),
  modified_on: z.number(),
  grid_pivot: z.null(), // Always null in the data
  sharer_sid: z.null(), // Always null in the data
});

// Schema for parsing the entire array
export const GridConfigArraySchema = z.array(GridConfigSchema);

// Type exports
export type ColumnSetting = z.infer<typeof ColumnSettingSchema>;
export type ColumnSettingsArray = z.infer<typeof ColumnSettingsArraySchema>;
export type FilterSettings = z.infer<typeof FilterSettingsSchema>;
export type GridConfig = z.infer<typeof GridConfigSchema>;
export type GridConfigArray = z.infer<typeof GridConfigArraySchema>;
