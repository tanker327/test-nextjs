import { z } from 'zod';

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

export const UserSchema = z.object({
  sid: z.string(),
  preferredFirstName: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  middleName: z.string().nullable(),
  email: z.string().nullable(),
  managerSid: z.string().nullable(),
  isActive: z.boolean().nullable(),
  corporateTitle: z.string().nullable(),
  employeeType: z.string().nullable(),
  costCenter: z.string().nullable(),
  resourcePath: z.string().nullable(),
});

export const GridStateColumnSchema = z.object({
  colId: z.string(),
  width: z.number(),
  hide: z.boolean(),
  pinned: z.union([z.literal('left'), z.literal('right'), z.null()]),
  sort: z.union([z.literal('asc'), z.literal('desc'), z.null()]),
  sortIndex: z.number().nullable(),
  aggFunc: z.union([z.literal('sum'), z.null()]),
  rowGroup: z.boolean(),
  rowGroupIndex: z.number().nullable(),
  pivot: z.boolean(),
  pivotIndex: z.number().nullable(),
  flex: z.number().nullable(),
});

// ag-grid ISimpleFilterModelType enum values
const SimpleFilterModelTypeSchema = z.enum([
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
]);

// Base ISimpleFilterModel interface
const BaseSimpleFilterModelSchema = z.object({
  type: SimpleFilterModelTypeSchema.nullable().optional(),
});

// TextFilterModel (extends ISimpleFilterModel)
const TextFilterModelSchema = BaseSimpleFilterModelSchema.extend({
  filterType: z.literal('text').optional(),
  filter: z.string().nullable().optional(),
  filterTo: z.string().nullable().optional(),
});

// NumberFilterModel (extends ISimpleFilterModel)
const NumberFilterModelSchema = BaseSimpleFilterModelSchema.extend({
  filterType: z.literal('number').optional(),
  filter: z.number().nullable().optional(),
  filterTo: z.number().nullable().optional(),
});

// DateFilterModel (extends ISimpleFilterModel)
const DateFilterModelSchema = BaseSimpleFilterModelSchema.extend({
  filterType: z.literal('date').optional(),
  dateFrom: z.string().nullable().optional(),
  dateTo: z.string().nullable().optional(),
});

// SetFilterModel interface
const SetFilterModelSchema = z.object({
  filterType: z.literal('set').optional(),
  values: z.array(z.string()).optional(),
});

// MultiFilterModel interface
const MultiFilterModelSchema = z.object({
  filterType: z.literal('multi'),
  filterModels: z.array(z.any().nullable()),
});

// ICombinedSimpleModel interface for filters with conditions
const CombinedTextFilterModelSchema = z.object({
  filterType: z.literal('text').optional(),
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(TextFilterModelSchema),
});

const CombinedNumberFilterModelSchema = z.object({
  filterType: z.literal('number').optional(),
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(NumberFilterModelSchema),
});

const CombinedDateFilterModelSchema = z.object({
  filterType: z.literal('date').optional(),
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(DateFilterModelSchema),
});

// Union of all possible filter models (including combined models)
export const FilterConditionSchema = z.union([
  CombinedTextFilterModelSchema,
  CombinedNumberFilterModelSchema,
  CombinedDateFilterModelSchema,
  TextFilterModelSchema,
  NumberFilterModelSchema,
  DateFilterModelSchema,
  SetFilterModelSchema,
  MultiFilterModelSchema,
]);

export const GridStateFilterModelSchema = z.record(z.string(), z.any());

export const GridStateSchema = z.object({
  columnState: z.array(GridStateColumnSchema),
  filterModel: GridStateFilterModelSchema,
  isPivotMode: z.boolean(),
  density: z.string(),
  theme: z.string(),
  gridBackground: z.string(),
});

export const ViewConfigSchema = z.object({
  viewId: z.string(),
  version: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  type: z.string(),
  owners: z.array(UserSchema),
  userFilterSid: z.string(),
  userFilterScope: z.string(),
  gridState: parseJsonString(GridStateSchema),
  quickSearchString: z.string(),
  isFavorite: z.boolean(),
  isDefault: z.boolean(),
  isOwner: z.boolean(),
  isOriginalViewDeleted: z.boolean(),
  isMetadataDeleted: z.boolean(),
  createdBy: UserSchema,
  createdAt: z.string(),
  updatedBy: UserSchema,
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type GridStateColumn = z.infer<typeof GridStateColumnSchema>;
export type FilterCondition = z.infer<typeof FilterConditionSchema>;
export type GridStateFilterModel = z.infer<typeof GridStateFilterModelSchema>;
export type GridState = z.infer<typeof GridStateSchema>;
export type ViewConfig = z.infer<typeof ViewConfigSchema>;
