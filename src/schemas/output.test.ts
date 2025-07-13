import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  ViewConfigSchema,
  UserSchema,
  GridStateSchema,
  GridStateColumnSchema,
  FilterConditionSchema,
  GridStateFilterModelSchema,
} from './output';

const dataPath = join(__dirname, '../../docs/new_data.json');
const newData = JSON.parse(readFileSync(dataPath, 'utf-8'));

describe('Output Schema Validation with Real Data', () => {
  describe('ViewConfigSchema', () => {
    test('should validate the complete new_data.json file', () => {
      const result = ViewConfigSchema.safeParse(newData);

      if (!result.success) {
        console.error('Validation errors:', result.error.issues);
      }

      expect(result.success).toBe(true);
      expect(result.data?.viewId).toBe('685572aae047866f8e7c8dc8');
      expect(result.data?.type).toBe('IPSM');
      expect(result.data?.name).toBe('Show All');
    });

    test('should validate view metadata fields', () => {
      const result = ViewConfigSchema.safeParse(newData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.version).toBe(1752377902);
        expect(result.data.description).toBeNull();
        expect(result.data.category).toBeNull();
        expect(result.data.userFilterSid).toBe('U123456');
        expect(result.data.userFilterScope).toBe('ALL');
        expect(result.data.quickSearchString).toBe('');
      }
    });

    test('should validate boolean flags', () => {
      const result = ViewConfigSchema.safeParse(newData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.isFavorite).toBe(true);
        expect(result.data.isDefault).toBe(true);
        expect(result.data.isOwner).toBe(true);
        expect(result.data.isOriginalViewDeleted).toBe(false);
        expect(result.data.isMetadataDeleted).toBe(false);
      }
    });

    test('should validate timestamp fields', () => {
      const result = ViewConfigSchema.safeParse(newData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.createdAt).toBe('2025-06-20T14:39:38.265');
        expect(result.data.updatedAt).toBe('2025-07-13T03:38:22.082703201');
      }
    });
  });

  describe('UserSchema', () => {
    test('should validate owner user with complete data', () => {
      const owner = newData.owners[0];
      const result = UserSchema.safeParse(owner);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sid).toBe('U123456');
        expect(result.data.preferredFirstName).toBe('John');
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
        expect(result.data.middleName).toBeNull();
        expect(result.data.email).toBe('john.doe@company.com');
        expect(result.data.managerSid).toBe('M789012');
        expect(result.data.isActive).toBe(true);
        expect(result.data.corporateTitle).toBe('VP');
        expect(result.data.employeeType).toBe('Employee');
        expect(result.data.costCenter).toBe('100001');
        expect(result.data.resourcePath).toContain('Doe,John(U123456)');
      }
    });

    test('should validate createdBy user with partial data', () => {
      const createdBy = newData.createdBy;
      const result = UserSchema.safeParse(createdBy);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sid).toBe('U123456');
        expect(result.data.preferredFirstName).toBeNull();
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
        expect(result.data.email).toBeNull();
        expect(result.data.managerSid).toBeNull();
        expect(result.data.isActive).toBeNull();
      }
    });

    test('should validate updatedBy user', () => {
      const updatedBy = newData.updatedBy;
      const result = UserSchema.safeParse(updatedBy);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sid).toBe('U123456');
        expect(result.data.firstName).toBe('John');
        expect(result.data.lastName).toBe('Doe');
      }
    });
  });

  describe('GridStateSchema', () => {
    test('should parse and validate gridState JSON string', () => {
      const result = ViewConfigSchema.safeParse(newData);
      expect(result.success).toBe(true);

      if (result.success) {
        const gridState = result.data.gridState;
        expect(gridState).toBeDefined();
        expect(Array.isArray(gridState.columnState)).toBe(true);
        expect(gridState.columnState.length).toBe(61);
        expect(gridState.isPivotMode).toBe(false);
        expect(gridState.density).toBe('high');
        expect(gridState.theme).toBe('light');
        expect(gridState.gridBackground).toBe('primary');
      }
    });

    test('should validate grid state properties', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const result = GridStateSchema.safeParse(gridStateJson);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.columnState).toHaveLength(61);
        expect(typeof result.data.filterModel).toBe('object');
        expect(result.data.isPivotMode).toBe(false);
        expect(result.data.density).toBe('high');
        expect(result.data.theme).toBe('light');
        expect(result.data.gridBackground).toBe('primary');
      }
    });
  });

  describe('GridStateColumnSchema', () => {
    test('should validate column with pinned left', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const pinnedColumn = gridStateJson.columnState.find(
        (col: { pinned: string }) => col.pinned === 'left',
      );

      expect(pinnedColumn).toBeDefined();
      const result = GridStateColumnSchema.safeParse(pinnedColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.colId).toBe('ipSelectionCheckbox');
        expect(result.data.width).toBe(66);
        expect(result.data.hide).toBe(false);
        expect(result.data.pinned).toBe('left');
        expect(result.data.sort).toBeNull();
        expect(result.data.sortIndex).toBeNull();
        expect(result.data.aggFunc).toBeNull();
        expect(result.data.rowGroup).toBe(false);
        expect(result.data.rowGroupIndex).toBeNull();
        expect(result.data.pivot).toBe(false);
        expect(result.data.pivotIndex).toBeNull();
        expect(result.data.flex).toBeNull();
      }
    });

    test('should validate column with pinned right', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const pinnedColumn = gridStateJson.columnState.find(
        (col: { pinned: string }) => col.pinned === 'right',
      );

      expect(pinnedColumn).toBeDefined();
      const result = GridStateColumnSchema.safeParse(pinnedColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.colId).toBe('action');
        expect(result.data.width).toBe(60);
        expect(result.data.pinned).toBe('right');
      }
    });

    test('should validate column with sum aggregation', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const aggColumn = gridStateJson.columnState.find(
        (col: { aggFunc: string }) => col.aggFunc === 'sum',
      );

      expect(aggColumn).toBeDefined();
      const result = GridStateColumnSchema.safeParse(aggColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.aggFunc).toBe('sum');
        expect(result.data.colId).toContain('financials.');
      }
    });

    test('should validate all column configurations', () => {
      const gridStateJson = JSON.parse(newData.gridState);

      gridStateJson.columnState.forEach((column: unknown, index: number) => {
        const result = GridStateColumnSchema.safeParse(column);

        if (!result.success) {
          console.error(`Column ${index} validation failed:`, result.error.issues);
        }

        expect(result.success).toBe(true);
      });
    });
  });

  describe('FilterConditionSchema and GridStateFilterModelSchema', () => {
    test('should validate text filter with OR conditions', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const shortIdFilter = gridStateJson.filterModel.shortId;

      const result = FilterConditionSchema.safeParse(shortIdFilter);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.filterType).toBe('text');
        // Type guard: check if it's a combined filter model
        if ('operator' in result.data && 'conditions' in result.data) {
          expect(result.data.operator).toBe('OR');
          expect(result.data.conditions).toHaveLength(2);
          expect(result.data.conditions?.[0]).toMatchObject({
            filterType: 'text',
            type: 'contains',
            filter: '9834',
          });
          expect(result.data.conditions?.[1]).toMatchObject({
            filterType: 'text',
            type: 'contains',
            filter: '23',
          });
        }
      }
    });

    test('should validate set filter', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const executionOnlyFilter = gridStateJson.filterModel.executionOnly;

      const result = FilterConditionSchema.safeParse(executionOnlyFilter);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.filterType).toBe('set');
        // Type guard: check if it's a set filter model
        if ('values' in result.data) {
          expect(result.data.values).toEqual(['Yes']);
        }
      }
    });

    test('should validate number filter', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const financialFilter = gridStateJson.filterModel['financials.outlook2024'];

      const result = FilterConditionSchema.safeParse(financialFilter);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.filterType).toBe('number');
        // Type guard: check if it's a simple number filter model
        if ('type' in result.data && 'filter' in result.data && !('conditions' in result.data)) {
          expect(result.data.type).toBe('greaterThan');
          expect(result.data.filter).toBe(100);
        }
      }
    });

    test('should validate complete filter model', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const result = GridStateFilterModelSchema.safeParse(gridStateJson.filterModel);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(Object.keys(result.data)).toEqual([
          'shortId',
          'executionOnly',
          'financials.outlook2024',
        ]);
      }
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle invalid JSON in gridState', () => {
      const invalidObject = {
        ...newData,
        gridState: 'invalid json{',
      };

      const result = ViewConfigSchema.safeParse(invalidObject);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid');
      }
    });

    test('should handle malformed grid state structure', () => {
      const invalidObject = {
        ...newData,
        gridState: '{"columnState": "not an array", "filterModel": {}}',
      };

      const result = ViewConfigSchema.safeParse(invalidObject);
      expect(result.success).toBe(false);
    });

    test('should validate with empty filter model', () => {
      const gridStateWithEmptyFilter = {
        columnState: [],
        filterModel: {},
        isPivotMode: false,
        density: 'normal',
        theme: 'light',
        gridBackground: 'primary',
      };

      const result = GridStateSchema.safeParse(gridStateWithEmptyFilter);
      expect(result.success).toBe(true);
      expect(result.data?.filterModel).toEqual({});
    });
  });

  describe('Data variations and completeness', () => {
    test('should handle all pinned variations', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const pinnedValues = [
        ...new Set(gridStateJson.columnState.map((col: { pinned: string | null }) => col.pinned)),
      ];

      const sortedPinned = pinnedValues.sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return (a as string).localeCompare(b as string);
      });

      expect(sortedPinned).toEqual([null, 'left', 'right']);
    });

    test('should handle all aggregation function variations', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const aggFuncValues = [
        ...new Set(gridStateJson.columnState.map((col: { aggFunc: string | null }) => col.aggFunc)),
      ];

      const sortedAggFunc = aggFuncValues.sort((a, b) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return (a as string).localeCompare(b as string);
      });

      expect(sortedAggFunc).toEqual([null, 'sum']);
    });

    test('should validate all column IDs are strings', () => {
      const gridStateJson = JSON.parse(newData.gridState);
      const colIds = gridStateJson.columnState.map((col: { colId: string }) => col.colId);

      colIds.forEach((colId: string) => {
        expect(typeof colId).toBe('string');
        expect(colId.length).toBeGreaterThan(0);
      });

      expect(colIds).toContain('ipSelectionCheckbox');
      expect(colIds).toContain('title');
      expect(colIds).toContain('action');
      expect(colIds.filter((id: string) => id.startsWith('financials.')).length).toBeGreaterThan(0);
    });

    test('should validate user data consistency', () => {
      const result = ViewConfigSchema.safeParse(newData);
      expect(result.success).toBe(true);

      if (result.success) {
        const ownerSid = result.data.owners[0].sid;
        const createdBySid = result.data.createdBy.sid;
        const updatedBySid = result.data.updatedBy.sid;
        const userFilterSid = result.data.userFilterSid;

        expect(ownerSid).toBe('U123456');
        expect(createdBySid).toBe('U123456');
        expect(updatedBySid).toBe('U123456');
        expect(userFilterSid).toBe('U123456');
      }
    });
  });

  describe('Filter schema validation with ag-grid examples', () => {
    test('should validate ICombinedSimpleModel text filter from example', () => {
      const textEqualsSwimmingOrEqualsGymnastics = {
        filterType: 'text',
        operator: 'OR',
        conditions: [
          {
            filterType: 'text',
            type: 'equals',
            filter: 'Swimming',
          },
          {
            filterType: 'text',
            type: 'equals',
            filter: 'Gymnastics',
          },
        ],
      };

      const result = FilterConditionSchema.safeParse(textEqualsSwimmingOrEqualsGymnastics);
      expect(result.success).toBe(true);
    });

    test('should validate ICombinedSimpleModel number filter from example', () => {
      const numberEquals18OrEquals20 = {
        filterType: 'number',
        operator: 'OR',
        conditions: [
          {
            filterType: 'number',
            type: 'equals',
            filter: 18,
          },
          {
            filterType: 'number',
            type: 'equals',
            filter: 20,
          },
        ],
      };

      const result = FilterConditionSchema.safeParse(numberEquals18OrEquals20);
      expect(result.success).toBe(true);
    });

    test('should validate ICombinedSimpleModel date filter from example', () => {
      const dateEquals04OrEquals08 = {
        filterType: 'date',
        operator: 'OR',
        conditions: [
          {
            filterType: 'date',
            type: 'equals',
            dateFrom: '2004-08-29',
          },
          {
            filterType: 'date',
            type: 'equals',
            dateFrom: '2008-08-24',
          },
        ],
      };

      const result = FilterConditionSchema.safeParse(dateEquals04OrEquals08);
      expect(result.success).toBe(true);
    });

    test('should validate multi filter model from example', () => {
      const multiFilterModel = {
        filterType: 'multi',
        filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
      };

      const result = FilterConditionSchema.safeParse(multiFilterModel);
      expect(result.success).toBe(true);
    });

    test('should validate simple text filter', () => {
      const simpleTextFilter = {
        filterType: 'text',
        type: 'contains',
        filter: 'John',
      };

      const result = FilterConditionSchema.safeParse(simpleTextFilter);
      expect(result.success).toBe(true);
    });

    test('should validate number range filter', () => {
      const numberRangeFilter = {
        filterType: 'number',
        type: 'inRange',
        filter: 100,
        filterTo: 500,
      };

      const result = FilterConditionSchema.safeParse(numberRangeFilter);
      expect(result.success).toBe(true);
    });

    test('should validate date range filter', () => {
      const dateRangeFilter = {
        filterType: 'date',
        type: 'inRange',
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
      };

      const result = FilterConditionSchema.safeParse(dateRangeFilter);
      expect(result.success).toBe(true);
    });

    test('should validate set filter', () => {
      const setFilter = {
        filterType: 'set',
        values: ['A', 'B', 'C'],
      };

      const result = FilterConditionSchema.safeParse(setFilter);
      expect(result.success).toBe(true);
    });
  });
});
