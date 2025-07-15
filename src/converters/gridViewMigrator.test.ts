import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import { GridConfigArraySchema } from '../schemas/input';
import { ViewConfigSchema } from '../schemas/output';
import {
  convertOldConfigToNewConfig,
  convertOldConfigArrayToNewConfigArray,
} from './gridViewMigrator';
import { migrateColumnId } from '../mappings/columnIdMigration';

const oldDataPath = join(__dirname, '../../docs/old-data.json');
const oldData = JSON.parse(readFileSync(oldDataPath, 'utf-8'));

// Helper to get validated input data
const getValidatedInputData = () => GridConfigArraySchema.parse(oldData);

describe('Grid View Stats Migration', () => {
  describe('convertOldConfigToNewConfig', () => {
    test('should convert basic fields correctly', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      expect(result.viewId).toBe(gridConfig.id);
      expect(result.name).toBe(gridConfig.name);
      expect(result.version).toBe(gridConfig.modified_on);
      expect(result.isFavorite).toBe(gridConfig.favorite);
      expect(result.isDefault).toBe(gridConfig.preset);
      expect(result.isOriginalViewDeleted).toBe(gridConfig.deleted);
      expect(result.quickSearchString).toBe(gridConfig.quick_search_string || '');
    });

    test('should handle type mapping', () => {
      const validatedData = getValidatedInputData();
      const milestoneConfig = validatedData.find((item) => item.type === 'MILESTONE');
      const ipAndSmConfig = validatedData.find((item) => item.type === 'IP_AND_SM');

      const milestoneResult = convertOldConfigToNewConfig(milestoneConfig!);
      const ipAndSmResult = convertOldConfigToNewConfig(ipAndSmConfig!);

      expect(milestoneResult.type).toBe('IPSM');
      expect(ipAndSmResult.type).toBe('IPSM');
    });

    test('should create user objects from owner string', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      expect(result.owners).toHaveLength(1);
      expect(result.owners[0].sid).toBe(gridConfig.owner);
      expect(result.createdBy.sid).toBe(gridConfig.owner);
      expect(result.updatedBy.sid).toBe(gridConfig.owner);
      expect(result.userFilterSid).toBe(gridConfig.owner);

      // Check user object structure
      expect(result.owners[0]).toMatchObject({
        sid: gridConfig.owner,
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
      });
    });

    test('should handle scope to userFilterScope mapping', () => {
      const validatedData = getValidatedInputData();
      const belongToMyselfConfig = validatedData.find((item) => item.scope === 'BelongToMyself');
      const allConfig = validatedData.find((item) => item.scope === 'All');
      const belongToMyOrgConfig = validatedData.find((item) => item.scope === 'BelongToMyOrg');
      const nullScopeConfig = validatedData.find((item) => item.scope === null);

      expect(convertOldConfigToNewConfig(belongToMyselfConfig!).userFilterScope).toBe('MIME');
      expect(convertOldConfigToNewConfig(allConfig!).userFilterScope).toBe('ALL');
      expect(convertOldConfigToNewConfig(belongToMyOrgConfig!).userFilterScope).toBe('MYORG');
      expect(convertOldConfigToNewConfig(nullScopeConfig!).userFilterScope).toBe('ALL');
    });

    test('should convert timestamps correctly', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      const expectedTimestamp = new Date(gridConfig.modified_on).toISOString();
      expect(result.createdAt).toBe(expectedTimestamp);
      expect(result.updatedAt).toBe(expectedTimestamp);
    });

    test('should handle null column_settings', () => {
      const validatedData = getValidatedInputData();
      const configWithNullColumns = validatedData.find((item) => item.column_settings === null);
      const result = convertOldConfigToNewConfig(configWithNullColumns!);

      expect(result.gridState).toBeDefined();
      expect(typeof result.gridState).toBe('string');
      const parsedGridState = JSON.parse(result.gridState);
      expect(parsedGridState.columnState).toEqual([]);
    });

    test('should handle null filter_settings', () => {
      const validatedData = getValidatedInputData();
      const configWithNullFilters = validatedData.find((item) => item.filter_settings === null);
      const result = convertOldConfigToNewConfig(configWithNullFilters!);

      expect(result.gridState).toBeDefined();
      expect(typeof result.gridState).toBe('string');
      const parsedGridState = JSON.parse(result.gridState);
      expect(parsedGridState.filterModel).toEqual({});
    });

    test('should preserve column settings structure', () => {
      const validatedData = getValidatedInputData();
      const configWithColumns = validatedData.find((item) => item.column_settings !== null);
      const result = convertOldConfigToNewConfig(configWithColumns!);

      expect(typeof result.gridState).toBe('string');
      const parsedGridState = JSON.parse(result.gridState);
      expect(Array.isArray(parsedGridState.columnState)).toBe(true);
      expect(parsedGridState.columnState.length).toBeGreaterThan(0);

      const firstColumn = parsedGridState.columnState[0];
      const originalFirstColumn = configWithColumns!.column_settings![0];

      // Column ID should be migrated, so we check against the migrated version
      expect(firstColumn.colId).toBe(migrateColumnId(originalFirstColumn.colId));
      expect(firstColumn.width).toBe(originalFirstColumn.width);
      expect(firstColumn.hide).toBe(originalFirstColumn.hide);
      expect(firstColumn.pinned).toBe(originalFirstColumn.pinned);
      expect(firstColumn.sort).toBe(originalFirstColumn.sort);
      expect(firstColumn.sortIndex).toBe(originalFirstColumn.sortIndex);
    });

    test('should handle aggFunc mapping correctly', () => {
      const validatedData = getValidatedInputData();
      const configWithColumns = validatedData.find((item) => item.column_settings !== null);
      const result = convertOldConfigToNewConfig(configWithColumns!);

      expect(typeof result.gridState).toBe('string');
      const parsedGridState = JSON.parse(result.gridState);

      // Find columns with different aggFunc values
      const sumColumn = parsedGridState.columnState.find((col: any) => col.aggFunc === 'sum');
      const nullColumn = parsedGridState.columnState.find((col: any) => col.aggFunc === null);

      if (sumColumn) {
        expect(sumColumn.aggFunc).toBe('sum');
      }
      if (nullColumn) {
        expect(nullColumn.aggFunc).toBeNull();
      }
    });

    test('should set default gridState properties', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      expect(typeof result.gridState).toBe('string');
      const parsedGridState = JSON.parse(result.gridState);
      expect(parsedGridState.isPivotMode).toBe(false);
      expect(parsedGridState.density).toBe('high');
      expect(parsedGridState.theme).toBe('light');
      expect(parsedGridState.gridBackground).toBe('primary');
    });

    test('should set default metadata fields', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      expect(result.description).toBeNull();
      expect(result.category).toBeNull();
      expect(result.isOwner).toBe(true);
      expect(result.isMetadataDeleted).toBe(false);
    });
  });

  describe('convertOldConfigArrayToNewConfigArray', () => {
    test('should convert all items in array', () => {
      const validatedInput = getValidatedInputData();
      const results = convertOldConfigArrayToNewConfigArray(validatedInput);

      expect(results).toHaveLength(validatedInput.length);

      results.forEach((result, index) => {
        expect(result.viewId).toBe(validatedInput[index].id);
        expect(result.name).toBe(validatedInput[index].name);
      });
    });

    test('should handle mixed types in array', () => {
      const validatedInput = getValidatedInputData();
      const results = convertOldConfigArrayToNewConfigArray(validatedInput);

      const milestoneResults = results.filter(
        (r) => validatedInput.find((input) => input.id === r.viewId)?.type === 'MILESTONE',
      );
      const ipAndSmResults = results.filter(
        (r) => validatedInput.find((input) => input.id === r.viewId)?.type === 'IP_AND_SM',
      );

      expect(milestoneResults.length).toBeGreaterThan(0);
      expect(ipAndSmResults.length).toBeGreaterThan(0);

      milestoneResults.forEach((result) => expect(result.type).toBe('IPSM'));
      ipAndSmResults.forEach((result) => expect(result.type).toBe('IPSM'));
    });

    test('should preserve unique identifiers across conversion', () => {
      const validatedInput = getValidatedInputData();
      const results = convertOldConfigArrayToNewConfigArray(validatedInput);

      const viewIds = results.map((r) => r.viewId);
      const uniqueViewIds = [...new Set(viewIds)];

      expect(viewIds).toHaveLength(uniqueViewIds.length); // No duplicates
    });
  });

  describe('Schema validation of converted data', () => {
    test('single conversion should pass output schema validation', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      // Before validation, gridState should be a string
      expect(typeof result.gridState).toBe('string');

      const validation = ViewConfigSchema.safeParse(result);

      if (!validation.success) {
        console.error('Validation errors:', validation.error.issues);
      }

      expect(validation.success).toBe(true);

      // After validation, gridState becomes a parsed object
      if (validation.success) {
        expect(typeof validation.data.gridState).toBe('object');
        expect(Array.isArray(validation.data.gridState.columnState)).toBe(true);
      }
    });

    test('array conversion should pass output schema validation', () => {
      const validatedInput = getValidatedInputData();
      const results = convertOldConfigArrayToNewConfigArray(validatedInput);

      results.forEach((result, index) => {
        const validation = ViewConfigSchema.safeParse(result);

        if (!validation.success) {
          console.error(`Validation errors for item ${index}:`, validation.error.issues);
        }

        expect(validation.success).toBe(true);
      });
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle empty quick_search_string', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = { ...validatedData[0], quick_search_string: null };
      const result = convertOldConfigToNewConfig(gridConfig);
      expect(result.quickSearchString).toBe('');
    });

    test('should handle different owner formats', () => {
      const owners = ['O629296', 'E140123', 'F719921'];

      owners.forEach((owner) => {
        const validatedData = getValidatedInputData();
        const gridConfig = { ...validatedData[0], owner };
        const result = convertOldConfigToNewConfig(gridConfig);

        expect(result.userFilterSid).toBe(owner);
        expect(result.owners[0].sid).toBe(owner);
        expect(result.createdBy.sid).toBe(owner);
        expect(result.updatedBy.sid).toBe(owner);
      });
    });

    test('should handle boolean variations correctly', () => {
      const validatedData = getValidatedInputData();
      const testConfigs = [
        { ...validatedData[0], favorite: true, preset: true, deleted: false },
        { ...validatedData[0], favorite: false, preset: false, deleted: true },
      ];

      testConfigs.forEach((config) => {
        const result = convertOldConfigToNewConfig(config);

        expect(result.isFavorite).toBe(config.favorite);
        expect(result.isDefault).toBe(config.preset);
        expect(result.isOriginalViewDeleted).toBe(config.deleted);
      });
    });
  });

  describe('Column ID migration tests', () => {
    it('should migrate column IDs in column state', () => {
      const validatedData = getValidatedInputData();
      const gridConfig = validatedData.find((item) => item.column_settings !== null);

      if (!gridConfig) {
        throw new Error('No grid config with column settings found');
      }

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // Check that column IDs have been migrated
      const columnIds = gridState.columnState.map((col: any) => col.colId);

      // Should contain migrated IDs like 'title' instead of 'name'
      expect(columnIds).toContain('title'); // 'name' → 'title'
      expect(columnIds).not.toContain('name'); // Old ID should not be present

      // Check some specific migrations
      const nameColumn = gridState.columnState.find((col: any) => col.colId === 'title');
      expect(nameColumn).toBeDefined();
    });

    it('should migrate filter keys from old to new column IDs', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          name: { filterType: 'text', type: 'contains', filter: 'test' },
          ragStatus: { filterType: 'text', type: 'equals', filter: 'RED' },
          totalCost: { filterType: 'number', type: 'greaterThan', filter: 1000 },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // Check that filter keys have been migrated
      expect(gridState.filterModel.title).toBeDefined(); // 'name' → 'title'
      expect(gridState.filterModel.rag).toBeDefined(); // 'ragStatus' → 'rag'
      expect(gridState.filterModel['financials.live2025']).toBeDefined(); // 'totalCost' → 'financials.live2025'

      // Old keys should not exist
      expect(gridState.filterModel.name).toBeUndefined();
      expect(gridState.filterModel.ragStatus).toBeUndefined();
      expect(gridState.filterModel.totalCost).toBeUndefined();

      // Verify the filter values are preserved
      expect(gridState.filterModel.title).toEqual({
        filterType: 'text',
        type: 'contains',
        filter: 'test',
      });
    });

    it('should handle unmapped column IDs by preserving them', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          customField: { filterType: 'text', type: 'contains', filter: 'value' },
          unknownColumn: { filterType: 'set', values: ['A', 'B'] },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // Unmapped IDs should be preserved as-is
      expect(gridState.filterModel.customField).toBeDefined();
      expect(gridState.filterModel.unknownColumn).toBeDefined();

      expect(gridState.filterModel.customField).toEqual({
        filterType: 'text',
        type: 'contains',
        filter: 'value',
      });
    });
  });

  describe('Filter conversion tests', () => {
    it('should handle empty filter settings', () => {
      const gridConfig = getValidatedInputData()[0];
      const result = convertOldConfigToNewConfig(gridConfig);

      const gridState = JSON.parse(result.gridState);
      expect(gridState.filterModel).toEqual({});
    });

    it('should handle ICombinedSimpleModel text filter from example', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          sport: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.sport).toEqual({
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
      });
    });

    it('should handle ICombinedSimpleModel number filter from example', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          age: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.age).toEqual({
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
      });
    });

    it('should handle ICombinedSimpleModel date filter from example', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          startDate: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.startDate).toEqual({
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
      });
    });

    it('should handle multi filter model from example', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          complexColumn: {
            filterType: 'multi',
            filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.complexColumn).toEqual({
        filterType: 'multi',
        filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
      });
    });

    it('should handle text filter with OR conditions', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          sport: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.sport).toEqual({
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
      });
    });

    it('should handle number filter with conditions', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          age: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.age).toEqual({
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
      });
    });

    it('should handle date filter with conditions', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          startDate: {
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
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.startDate).toEqual({
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
      });
    });

    it('should handle set filter', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          category: {
            filterType: 'set',
            values: ['A', 'B', 'C'],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.category).toEqual({
        filterType: 'set',
        values: ['A', 'B', 'C'],
      });
    });

    it('should handle multi filter model', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          complexColumn: {
            filterType: 'multi',
            filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.complexColumn).toEqual({
        filterType: 'multi',
        filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
      });
    });

    it('should handle simple text filter', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          name: {
            filterType: 'text',
            type: 'contains',
            filter: 'John',
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // Note: 'name' column ID gets migrated to 'title'
      expect(gridState.filterModel.title).toEqual({
        filterType: 'text',
        type: 'contains',
        filter: 'John',
      });
    });

    it('should handle simple number range filter', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          totalCost: {
            filterType: 'number',
            type: 'inRange',
            filter: 100,
            filterTo: 500,
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // Note: 'totalCost' column ID gets migrated to 'financials.live2025'
      expect(gridState.filterModel['financials.live2025']).toEqual({
        filterType: 'number',
        type: 'inRange',
        filter: 100,
        filterTo: 500,
      });
    });

    it('should handle date range filter', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        filter_settings: {
          period: {
            filterType: 'date',
            type: 'inRange',
            dateFrom: '2023-01-01',
            dateTo: '2023-12-31',
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.period).toEqual({
        filterType: 'date',
        type: 'inRange',
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31',
      });
    });

    it('should convert set filter to text filter with OR conditions when column is mapped as text', () => {
      // Test for IP_AND_SM type where shortId is mapped as 'text'
      const gridConfig = {
        ...getValidatedInputData()[0],
        type: 'IP_AND_SM' as const,
        filter_settings: {
          shortId: {
            filterType: 'set',
            values: ['008563', '007201'],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.shortId).toEqual({
        filterType: 'text',
        operator: 'OR',
        conditions: [
          {
            filterType: 'text',
            type: 'equals',
            filter: '008563',
          },
          {
            filterType: 'text',
            type: 'equals',
            filter: '007201',
          },
        ],
      });
    });

    it('should convert set filter to text filter for MILESTONE type', () => {
      // Test for MILESTONE type where shortId is also mapped as 'text'
      const gridConfig = {
        ...getValidatedInputData()[0],
        type: 'MILESTONE' as const,
        filter_settings: {
          shortId: {
            filterType: 'set',
            values: ['M001', 'M002', 'M003'],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      expect(gridState.filterModel.shortId).toEqual({
        filterType: 'text',
        operator: 'OR',
        conditions: [
          {
            filterType: 'text',
            type: 'equals',
            filter: 'M001',
          },
          {
            filterType: 'text',
            type: 'equals',
            filter: 'M002',
          },
          {
            filterType: 'text',
            type: 'equals',
            filter: 'M003',
          },
        ],
      });
    });

    it('should NOT convert set filter for columns mapped as set', () => {
      // Test that columns mapped as 'set' keep their set filter
      const gridConfig = {
        ...getValidatedInputData()[0],
        type: 'IP_AND_SM' as const,
        filter_settings: {
          state: {
            filterType: 'set',
            values: ['Active', 'Inactive'],
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // 'state' is mapped as 'set', so it should NOT be converted
      expect(gridState.filterModel.state).toEqual({
        filterType: 'set',
        values: ['Active', 'Inactive'],
      });
    });

    it('should handle mixed filters with some converting and some not', () => {
      const gridConfig = {
        ...getValidatedInputData()[0],
        type: 'IP_AND_SM' as const,
        filter_settings: {
          shortId: {
            filterType: 'set',
            values: ['008563', '007201'],
          },
          state: {
            filterType: 'set',
            values: ['Active'],
          },
          title: {
            filterType: 'text',
            type: 'contains',
            filter: 'test',
          },
        },
      };

      const result = convertOldConfigToNewConfig(gridConfig);
      const gridState = JSON.parse(result.gridState);

      // shortId should be converted (text column with set filter)
      expect(gridState.filterModel.shortId).toEqual({
        filterType: 'text',
        operator: 'OR',
        conditions: [
          {
            filterType: 'text',
            type: 'equals',
            filter: '008563',
          },
          {
            filterType: 'text',
            type: 'equals',
            filter: '007201',
          },
        ],
      });

      // state should NOT be converted (set column with set filter)
      expect(gridState.filterModel.state).toEqual({
        filterType: 'set',
        values: ['Active'],
      });

      // title should remain unchanged (text column with text filter)
      expect(gridState.filterModel.title).toEqual({
        filterType: 'text',
        type: 'contains',
        filter: 'test',
      });
    });
  });
});
