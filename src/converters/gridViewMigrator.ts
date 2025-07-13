import { GridConfig, ColumnSetting, FilterSettings } from '../schemas/input';
import { ViewConfig, User, GridState } from '../schemas/output';
import { migrateColumnId } from '../mappings/columnIdMigration';

// ✅ RESOLVED: GridState combines ag-grid standard structure with Phoenix-specific properties
// Based on actual data in new_data.json, the gridState contains both:
// - Standard ag-grid properties: columnState, filterModel
// - Phoenix-specific properties: isPivotMode, density, theme, gridBackground

// Raw ViewConfig before schema validation (gridState is still a JSON string)
type RawViewConfig = Omit<ViewConfig, 'gridState'> & {
  gridState: string;
};

// ✅ RESOLVED: User mapping strategy
// Solution: Use ownerSid as sid and set all other fields to null
// This approach keeps it simple and avoids assumptions about user data format
function createUserFromOwner(ownerSid: string): User {
  return {
    sid: ownerSid,
    preferredFirstName: null,
    firstName: null,
    lastName: null,
    middleName: null,
    email: null,
    managerSid: null,
    isActive: null,
    corporateTitle: null,
    employeeType: null,
    costCenter: null,
    resourcePath: null,
  };
}

// TODO: ATTENTION NEEDED - Scope mapping strategy
// Question: How should input 'scope' map to output 'userFilterScope'?
// Current mapping assumptions:
//   - 'BelongToMyself' -> 'MYSELF'
//   - 'All' -> 'ALL'
//   - 'BelongToMyOrg' -> 'ORG'
//   - null -> 'ALL' (default)
function mapScopeToFilterScope(scope: string | null): string {
  switch (scope) {
    case 'BelongToMyself':
      return 'MIME'; // TODO: Confirm this mapping
    case 'All':
      return 'ALL';
    case 'BelongToMyOrg':
      return 'MYORG'; // TODO: Confirm this mapping
    case null:
    default:
      return 'ALL'; // TODO: Confirm default behavior
  }
}

// TODO: ATTENTION NEEDED - Type mapping strategy
// Question: Should both 'MILESTONE' and 'IP_AND_SM' map to 'IPSM'?
// Or should there be different type mappings?
function mapGridTypeToViewType(type: 'MILESTONE' | 'IP_AND_SM'): string {
  // Current assumption: Both input types map to 'IPSM' in output
  // TODO: Confirm if this is correct or if we need different mappings
  switch (type) {
    case 'MILESTONE':
      return 'IPSM'; // TODO: Confirm mapping
    case 'IP_AND_SM':
      return 'IPSM';
    default:
      return 'IPSM';
  }
}

// NOTE: Field mapping analysis completed but not implemented in converter yet
// The grid definitions revealed comprehensive field mappings:
// - Financial fields: 'totalCostPreviousYear' → 'financials.live2024', etc.
// - Basic fields: 'name' → 'title', 'ragStatus' → 'rag', etc.
// This mapping would be useful for converting actual grid configurations,
// but our current converter handles pre-processed column settings data.

// ✅ UPDATED: Property mapping with column ID migration from old to new grid format
// Maps old ag-Grid properties to new ag-grid ColumnState format with migrated column IDs
// Reference: ag-grid-community/dist/types/src/columns/columnStateUtils.d.ts
function mapOldPropertiesToNew(col: ColumnSetting) {
  return {
    colId: migrateColumnId(col.colId), // ✅ NEW: Migrate column ID using mapping
    width: col.width, // Old grid used 'initialWidth', but our schema already uses 'width'
    hide: col.hide,
    pinned: col.pinned, // Old grid used 'lockPosition', but our schema already uses 'pinned'
    sort: col.sort,
    sortIndex: col.sortIndex,
    // ✅ RESOLVED: Based on ag-grid official types, aggFunc accepts string | IAggFunc | null
    // Built-in options: 'sum', 'min', 'max', 'count', 'avg', 'first', 'last'
    // Grid definitions show: defaultAggFunc: 'costSum' should map to aggFunc: 'sum'
    aggFunc: (col.aggFunc === 'sum' || col.aggFunc === 'costSum' ? 'sum' : null) as 'sum' | null,
    rowGroup: col.rowGroup,
    rowGroupIndex: col.rowGroupIndex,
    pivot: col.pivot,
    pivotIndex: col.pivotIndex,
    flex: col.flex,
  };
}

// ✅ UPDATED: GridState construction following ag-grid official GridState interface
// Reference: ag-grid-community/dist/types/src/interfaces/gridState.d.ts
function buildGridState(
  columnSettings: ColumnSetting[] | null,
  filterSettings: FilterSettings | null,
): GridState {
  // Transform column settings from input format to ag-grid ColumnState format
  const columnState = columnSettings?.map((col) => mapOldPropertiesToNew(col)) || [];

  // ✅ UPDATED: Using official ag-grid FilterModel type with migrated column IDs
  // FilterModel is Record<string, any> in ag-grid types
  // FilterSettings now properly typed as ag-grid filter models with migrated keys
  const filterModel: Record<string, unknown> = {};
  if (filterSettings) {
    // Migrate filter keys from old column IDs to new column IDs
    Object.entries(filterSettings).forEach(([oldColId, filterConfig]) => {
      const newColId = migrateColumnId(oldColId);
      filterModel[newColId] = filterConfig;
    });
  }

  // ✅ RESOLVED: Hybrid GridState structure based on actual Phoenix data
  // Combines standard ag-grid properties with Phoenix-specific extensions
  return {
    columnState,
    filterModel, // Now properly typed as Record<string, any>
    // Phoenix-specific properties (confirmed from new_data.json)
    isPivotMode: false, // ✅ Confirmed: Phoenix extends ag-grid with this property
    density: 'high', // ✅ Confirmed: Phoenix grid density setting
    theme: 'light', // ✅ Confirmed: Phoenix theming system
    gridBackground: 'primary', // ✅ Confirmed: Phoenix background style
  };
}

// TODO: ATTENTION NEEDED - Version generation strategy
// Question: What logic should be used for the version field?
// Options:
//   1. Use modified_on timestamp (current approach)
//   2. Generate new timestamp
//   3. Use incremental version number
//   4. Use hash of content
function generateVersion(modifiedOn: number): number {
  // Current approach: Use the modified_on timestamp as version
  // TODO: Confirm if this is the correct versioning strategy
  return modifiedOn;
}

// TODO: ATTENTION NEEDED - Timestamp conversion
// Question: Should we use modified_on for both createdAt and updatedAt?
// Or should we generate current timestamp for updatedAt?
function convertTimestamp(timestamp: number): string {
  // Convert milliseconds timestamp to ISO 8601 string
  return new Date(timestamp).toISOString();
}

/**
 * Migrates a grid view configuration from old version to new version format
 *
 * Converts GridConfig (old format) to ViewConfig (new format) for grid view stats migration.
 * This handles the transformation of grid state, column settings, filters, and metadata
 * from the legacy grid system to the new view configuration system.
 *
 * @param gridConfig - The legacy grid configuration to migrate
 * @returns Migrated view configuration in new format
 */
export function convertOldConfigToNewConfig(gridConfig: GridConfig): RawViewConfig {
  const user = createUserFromOwner(gridConfig.owner);
  const gridState = buildGridState(gridConfig.column_settings, gridConfig.filter_settings);

  return {
    viewId: gridConfig.id,
    version: generateVersion(gridConfig.modified_on),
    name: gridConfig.name,
    description: null, // TODO: ATTENTION NEEDED - No equivalent in input
    category: null, // TODO: ATTENTION NEEDED - No equivalent in input
    type: mapGridTypeToViewType(gridConfig.type),
    owners: [user], // TODO: ATTENTION NEEDED - Single owner vs array
    userFilterSid: gridConfig.owner, // TODO: ATTENTION NEEDED - Confirm mapping
    userFilterScope: mapScopeToFilterScope(gridConfig.scope),
    gridState: JSON.stringify(gridState), // Convert object to JSON string
    quickSearchString: gridConfig.quick_search_string || '',
    isFavorite: gridConfig.favorite,
    isDefault: gridConfig.preset, // TODO: ATTENTION NEEDED - Confirm preset -> isDefault mapping
    isOwner: true, // TODO: ATTENTION NEEDED - Always true or context-dependent?
    isOriginalViewDeleted: gridConfig.deleted,
    isMetadataDeleted: false, // TODO: ATTENTION NEEDED - No equivalent in input, default to false
    createdBy: user,
    createdAt: convertTimestamp(gridConfig.modified_on), // TODO: ATTENTION NEEDED - No separate created timestamp
    updatedBy: user,
    updatedAt: convertTimestamp(gridConfig.modified_on),
  };
}

/**
 * Migrates an array of grid view configurations from old version to new version format
 *
 * Batch migration utility for converting multiple legacy grid configurations
 * to the new view configuration format.
 */
export function convertOldConfigArrayToNewConfigArray(gridConfigs: GridConfig[]): RawViewConfig[] {
  return gridConfigs.map(convertOldConfigToNewConfig);
}

// TODO: ATTENTION NEEDED - Batch conversion considerations
// Questions for batch operations:
// 1. Should we maintain relationships between converted items?
// 2. How should we handle duplicate owners across items?
// 3. Should version numbers be coordinated across the batch?
// 4. Error handling strategy for partial failures?
