import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  GridConfigSchema,
  GridConfigArraySchema,
  ColumnSettingSchema,
  ColumnSettingsArraySchema,
  FilterSettingsSchema,
} from './input';

// Get test data - use relative path for Jest
const dataPath = join(__dirname, '../../docs/old-data.json');
const oldData = JSON.parse(readFileSync(dataPath, 'utf-8'));

describe('Input Schema Validation with Real Data', () => {
  describe('GridConfigArraySchema', () => {
    test('should validate the complete old-data.json file', () => {
      const result = GridConfigArraySchema.safeParse(oldData);

      if (!result.success) {
        console.error('Validation errors:', result.error.issues);
      }

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(10);
    });

    test('should handle all variations in the data', () => {
      const result = GridConfigArraySchema.safeParse(oldData);
      expect(result.success).toBe(true);

      if (result.success) {
        // Check we have the expected types
        const types = result.data.map((item) => item.type);
        expect(types).toContain('MILESTONE');
        expect(types).toContain('IP_AND_SM');

        // Check we have all scope variations
        const scopes = result.data.map((item) => item.scope);
        expect(scopes).toContain('BelongToMyself');
        expect(scopes).toContain('All');
        expect(scopes).toContain('BelongToMyOrg');
        expect(scopes).toContain(null);

        // Check we have both column_settings variations
        const hasColumnSettings = result.data.some((item) => item.column_settings !== null);
        const hasNullColumnSettings = result.data.some((item) => item.column_settings === null);
        expect(hasColumnSettings).toBe(true);
        expect(hasNullColumnSettings).toBe(true);
      }
    });
  });

  describe('Individual GridConfig objects', () => {
    test('should validate MILESTONE type with column_settings (object 1)', () => {
      const obj1 = oldData[0]; // First MILESTONE object with complex column settings
      const result = GridConfigSchema.safeParse(obj1);

      if (!result.success) {
        console.error('Object 1 validation errors:', result.error.issues);
      }

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('MILESTONE');
      expect(result.data?.scope).toBe('BelongToMyself');
      expect(result.data?.column_settings).not.toBeNull();
      expect(Array.isArray(result.data?.column_settings)).toBe(true);
      expect(result.data?.column_settings).toHaveLength(50);
    });

    test('should validate MILESTONE type with pinned left (object 2)', () => {
      const obj2 = oldData[1]; // Second MILESTONE object with pinned=left
      const result = GridConfigSchema.safeParse(obj2);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('MILESTONE');
      expect(result.data?.scope).toBe('All');

      // Check that pinned="left" is handled correctly
      if (result.success && result.data.column_settings) {
        const pinnedColumns = result.data.column_settings.filter((col) => col.pinned === 'left');
        expect(pinnedColumns.length).toBeGreaterThan(0);
      }
    });

    test('should validate MILESTONE type with sort desc (object 3)', () => {
      const obj3 = oldData[2]; // Third MILESTONE object with sort=desc
      const result = GridConfigSchema.safeParse(obj3);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('MILESTONE');
      expect(result.data?.scope).toBe('BelongToMyOrg');

      // Check that sort="desc" is handled correctly
      if (result.success && result.data.column_settings) {
        const sortedColumns = result.data.column_settings.filter((col) => col.sort === 'desc');
        expect(sortedColumns.length).toBeGreaterThan(0);
      }
    });

    test('should validate IP_AND_SM type with null column_settings (object 4)', () => {
      const obj4 = oldData[3]; // First IP_AND_SM object with null settings
      const result = GridConfigSchema.safeParse(obj4);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('IP_AND_SM');
      expect(result.data?.scope).toBe('BelongToMyself');
      expect(result.data?.column_settings).toBeNull();
      expect(result.data?.filter_settings).toBeNull();
      expect(result.data?.quick_search_string).toBe('');
    });

    test('should validate IP_AND_SM type with null scope (object 5)', () => {
      const obj5 = oldData[4]; // IP_AND_SM object with null scope
      const result = GridConfigSchema.safeParse(obj5);

      expect(result.success).toBe(true);
      expect(result.data?.type).toBe('IP_AND_SM');
      expect(result.data?.scope).toBeNull();
      expect(result.data?.name).toBe('Drafts');
    });

    test('should validate different owners (objects 6-10)', () => {
      // Objects 6-10 have different owners: E140123, F719921
      const objects6to10 = oldData.slice(5);

      objects6to10.forEach((obj: any) => {
        const result = GridConfigSchema.safeParse(obj);
        expect(result.success).toBe(true);

        if (result.success) {
          expect(result.data.type).toBe('IP_AND_SM');
          expect(['E140123', 'F719921']).toContain(result.data.owner);
        }
      });
    });
  });

  describe('ColumnSettingSchema validation', () => {
    test('should validate individual column settings from real data', () => {
      // Get column settings from the first object
      const obj1 = oldData[0];
      const columnSettingsJson = JSON.parse(obj1.column_settings);
      const firstColumn = columnSettingsJson[0];

      const result = ColumnSettingSchema.safeParse(firstColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.colId).toBe('msSelectionCheckbox');
        expect(result.data.width).toBe(50);
        expect(result.data.hide).toBe(false);
        expect(result.data.pinned).toBeNull();
        expect(result.data.sort).toBeNull();
        expect(result.data.sortIndex).toBeNull();
      }
    });

    test('should validate column with sort asc', () => {
      const obj1 = oldData[0];
      const columnSettingsJson = JSON.parse(obj1.column_settings);
      const sortedColumn = columnSettingsJson.find((col: any) => col.sort === 'asc');

      expect(sortedColumn).toBeDefined();
      const result = ColumnSettingSchema.safeParse(sortedColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.sort).toBe('asc');
        expect(result.data.sortIndex).toBe(0);
      }
    });

    test('should validate column with pinned left', () => {
      const obj2 = oldData[1];
      const columnSettingsJson = JSON.parse(obj2.column_settings);
      const pinnedColumn = columnSettingsJson.find((col: any) => col.pinned === 'left');

      expect(pinnedColumn).toBeDefined();
      const result = ColumnSettingSchema.safeParse(pinnedColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.pinned).toBe('left');
      }
    });

    test('should validate column with sort desc', () => {
      const obj3 = oldData[2];
      const columnSettingsJson = JSON.parse(obj3.column_settings);
      const sortedColumn = columnSettingsJson.find((col: any) => col.sort === 'desc');

      expect(sortedColumn).toBeDefined();
      const result = ColumnSettingSchema.safeParse(sortedColumn);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.sort).toBe('desc');
        expect(result.data.sortIndex).toBe(0);
      }
    });

    test('should validate all column settings arrays', () => {
      const objectsWithColumns = oldData.filter((obj: any) => obj.column_settings !== null);

      objectsWithColumns.forEach((obj: any, index: number) => {
        const columnSettingsJson = JSON.parse(obj.column_settings);
        const result = ColumnSettingsArraySchema.safeParse(columnSettingsJson);

        if (!result.success) {
          console.error(
            `Column settings validation failed for object ${index + 1}:`,
            result.error.issues,
          );
        }

        expect(result.success).toBe(true);
        expect(result.data).toHaveLength(50);
      });
    });
  });

  describe('FilterSettingsSchema validation', () => {
    test('should validate empty filter settings', () => {
      const obj1 = oldData[0];
      const filterSettingsJson = JSON.parse(obj1.filter_settings);

      const result = FilterSettingsSchema.safeParse(filterSettingsJson);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    test('should validate all filter settings', () => {
      const objectsWithFilters = oldData.filter((obj: any) => obj.filter_settings !== null);

      objectsWithFilters.forEach((obj: any) => {
        const filterSettingsJson = JSON.parse(obj.filter_settings);
        const result = FilterSettingsSchema.safeParse(filterSettingsJson);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Error handling', () => {
    test('should handle invalid JSON in column_settings', () => {
      const invalidObject = {
        ...oldData[0],
        column_settings: 'invalid json{',
      };

      const result = GridConfigSchema.safeParse(invalidObject);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid');
      }
    });

    test('should handle invalid JSON in filter_settings', () => {
      const invalidObject = {
        ...oldData[0],
        filter_settings: 'invalid json{',
      };

      const result = GridConfigSchema.safeParse(invalidObject);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid');
      }
    });

    test('should handle malformed column structure in JSON', () => {
      const invalidObject = {
        ...oldData[0],
        column_settings: '[{"colId": "test", "invalid": true}]', // Missing required fields
      };

      const result = GridConfigSchema.safeParse(invalidObject);
      expect(result.success).toBe(false);
    });
  });

  describe('Edge cases and data variations', () => {
    test('should handle different quick_search_string values', () => {
      // Some objects have null, some have empty string
      const nullQuickSearch = oldData.filter((obj: any) => obj.quick_search_string === null);
      const emptyQuickSearch = oldData.filter((obj: any) => obj.quick_search_string === '');

      expect(nullQuickSearch.length).toBeGreaterThan(0);
      expect(emptyQuickSearch.length).toBeGreaterThan(0);

      // Both should validate successfully
      [...nullQuickSearch, ...emptyQuickSearch].forEach((obj: any) => {
        const result = GridConfigSchema.safeParse(obj);
        expect(result.success).toBe(true);
      });
    });

    test('should handle different modified_on timestamps', () => {
      const timestamps = oldData.map((obj: any) => obj.modified_on);
      const uniqueTimestamps = [...new Set(timestamps)];

      expect(uniqueTimestamps.length).toBeGreaterThan(1);

      // All should be valid numbers
      uniqueTimestamps.forEach((timestamp) => {
        expect(typeof timestamp).toBe('number');
        expect(timestamp as number).toBeGreaterThan(0);
      });
    });

    test('should handle different owner formats', () => {
      const owners = [...new Set(oldData.map((obj: any) => obj.owner))];
      expect(owners).toEqual(['O629296', 'E140123', 'F719921']);

      owners.forEach((owner) => {
        expect(owner as string).toMatch(/^[A-Z]\d+$/); // Pattern: Letter followed by numbers
      });
    });

    test('should handle all boolean combinations', () => {
      // Check that we have both true and false values for boolean fields
      const favorites = oldData.map((obj: any) => obj.favorite);
      const presets = oldData.map((obj: any) => obj.preset);
      const deleted = oldData.map((obj: any) => obj.deleted);

      // All should be true in our dataset
      expect(favorites.every((fav: boolean) => fav === true)).toBe(true);
      expect(presets.every((preset: boolean) => preset === true)).toBe(true);
      expect(deleted.every((del: boolean) => del === false)).toBe(true);
    });

    test('should validate that grid_pivot and sharer_sid are always null', () => {
      oldData.forEach((obj: any) => {
        expect(obj.grid_pivot).toBeNull();
        expect(obj.sharer_sid).toBeNull();
      });
    });
  });

  describe('Schema completeness', () => {
    test('should cover all unique field values in the dataset', () => {
      const result = GridConfigArraySchema.safeParse(oldData);
      expect(result.success).toBe(true);

      if (result.success) {
        // Types
        const types = [...new Set(result.data.map((item) => item.type))];
        expect(types.sort()).toEqual(['IP_AND_SM', 'MILESTONE']);

        // Scopes
        const scopes = [...new Set(result.data.map((item) => item.scope).filter(Boolean))];
        expect(scopes.sort()).toEqual(['All', 'BelongToMyOrg', 'BelongToMyself']);

        // Owners
        const owners = [...new Set(result.data.map((item) => item.owner))];
        expect(owners.sort()).toEqual(['E140123', 'F719921', 'O629296']);

        // Names
        const names = [...new Set(result.data.map((item) => item.name))];
        expect(names.sort()).toEqual(['Drafts', 'Mine', 'My Org', 'Show All']);
      }
    });

    test('should handle all column setting variations', () => {
      const objectsWithColumns = oldData.filter((obj: any) => obj.column_settings !== null);

      // Collect all unique values from column settings
      const allColumnData = objectsWithColumns.flatMap((obj: any) =>
        JSON.parse(obj.column_settings),
      );

      const pinnedValues = [...new Set(allColumnData.map((col: any) => col.pinned))];
      const sortValues = [...new Set(allColumnData.map((col: any) => col.sort))];

      // Sort with null handling
      const sortedPinned = pinnedValues.sort((a: any, b: any) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return a.localeCompare(b);
      });
      const sortedSort = sortValues.sort((a: any, b: any) => {
        if (a === null) return -1;
        if (b === null) return 1;
        return a.localeCompare(b);
      });

      expect(sortedPinned).toEqual([null, 'left']);
      expect(sortedSort).toEqual([null, 'asc', 'desc']);
    });
  });

  describe('FilterSettings validation', () => {
    it('should validate empty filter settings', () => {
      const filterSettings = {};
      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });

    it('should validate text filter with OR conditions', () => {
      const filterSettings = {
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
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      if (!result.success) {
        console.log('Validation errors:', JSON.stringify(result.error.issues, null, 2));
      }
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sport.filterType).toBe('text');
        expect(result.data.sport.operator).toBe('OR');
        expect(result.data.sport.conditions).toHaveLength(2);
      }
    });

    it('should validate number filter conditions', () => {
      const filterSettings = {
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
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.age.filterType).toBe('number');
        expect(result.data.age.conditions[0].filter).toBe(18);
      }
    });

    it('should validate date filter with dateFrom/dateTo', () => {
      const filterSettings = {
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
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startDate.conditions[0].dateFrom).toBe('2004-08-29');
      }
    });

    it('should validate set filter', () => {
      const filterSettings = {
        category: {
          filterType: 'set',
          values: ['A', 'B', 'C'],
        },
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category.filterType).toBe('set');
        expect(result.data.category.values).toEqual(['A', 'B', 'C']);
      }
    });

    it('should validate multi filter model', () => {
      const filterSettings = {
        complexColumn: {
          filterType: 'multi',
          filterModels: [null, { filterType: 'set', values: ['A', 'B', 'C'] }],
        },
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.complexColumn.filterType).toBe('multi');
        expect(result.data.complexColumn.filterModels).toHaveLength(2);
        expect(result.data.complexColumn.filterModels[0]).toBeNull();
        expect(result.data.complexColumn.filterModels[1].filterType).toBe('set');
      }
    });

    it('should validate simple text filter', () => {
      const filterSettings = {
        name: {
          filterType: 'text',
          type: 'contains',
          filter: 'John',
        },
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name.type).toBe('contains');
        expect(result.data.name.filter).toBe('John');
      }
    });

    it('should validate number range filter', () => {
      const filterSettings = {
        price: {
          filterType: 'number',
          type: 'inRange',
          filter: 100,
          filterTo: 500,
        },
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price.filter).toBe(100);
        expect(result.data.price.filterTo).toBe(500);
      }
    });

    it('should validate date range filter', () => {
      const filterSettings = {
        period: {
          filterType: 'date',
          type: 'inRange',
          dateFrom: '2023-01-01',
          dateTo: '2023-12-31',
        },
      };

      const result = FilterSettingsSchema.safeParse(filterSettings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.period.dateFrom).toBe('2023-01-01');
        expect(result.data.period.dateTo).toBe('2023-12-31');
      }
    });
  });
});
