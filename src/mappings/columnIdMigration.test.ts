import { describe, test, expect } from '@jest/globals';
import {
  COLUMN_ID_MIGRATION_MAP,
  COLUMN_ID_MAP,
  REVERSE_COLUMN_ID_MAP,
  migrateColumnId,
  migrateColumnIds,
  reverseMigrateColumnId,
  getUnmappedColumnIds,
  getMigrationStats,
} from './columnIdMigration';

describe('Column ID Migration', () => {
  describe('migrateColumnId', () => {
    test('should migrate known column IDs', () => {
      expect(migrateColumnId('name')).toBe('title');
      expect(migrateColumnId('ragStatus')).toBe('rag');
      expect(migrateColumnId('isExecutionOnly')).toBe('executionOnly');
      expect(migrateColumnId('totalCost')).toBe('financials.live2025');
      expect(migrateColumnId('chiefTechnologyOfficer')).toBe('cto');
    });

    test('should return original ID for unmapped columns', () => {
      expect(migrateColumnId('unknownColumn')).toBe('unknownColumn');
      expect(migrateColumnId('customField')).toBe('customField');
    });

    test('should handle financial field migrations correctly', () => {
      expect(migrateColumnId('totalCostPreviousYear')).toBe('financials.live2024');
      expect(migrateColumnId('forecastTotalCost')).toBe('financials.outlook2025');
      expect(migrateColumnId('budgetTotalCostNextYear')).toBe('financials.budget2026');
    });

    test('should handle organization field migrations', () => {
      expect(migrateColumnId('l1SponsoringOrganization')).toBe('l1SponsorOrganization');
      expect(migrateColumnId('l2SponsoringOrganization')).toBe('l2SponsorOrganization');
      expect(migrateColumnId('l3SponsoringOrganization')).toBe('l3SponsorOrganization');
    });

    test('should handle lead role simplifications', () => {
      expect(migrateColumnId('salesLeads')).toBe('salesLead');
      expect(migrateColumnId('quantLeads')).toBe('quantLead');
      expect(migrateColumnId('uxLeads')).toBe('uxLead');
      expect(migrateColumnId('productLeads')).toBe('productLead');
    });
  });

  describe('migrateColumnIds', () => {
    test('should migrate array of column IDs', () => {
      const oldIds = ['name', 'ragStatus', 'totalCost', 'unknownField'];
      const expected = ['title', 'rag', 'financials.live2025', 'unknownField'];

      expect(migrateColumnIds(oldIds)).toEqual(expected);
    });

    test('should handle empty array', () => {
      expect(migrateColumnIds([])).toEqual([]);
    });
  });

  describe('reverseMigrateColumnId', () => {
    test('should reverse migrate known column IDs', () => {
      expect(reverseMigrateColumnId('title')).toBe('name');
      expect(reverseMigrateColumnId('rag')).toBe('ragStatus');
      expect(reverseMigrateColumnId('financials.live2025')).toBe('totalCost');
      expect(reverseMigrateColumnId('cto')).toBe('chiefTechnologyOfficer');
    });

    test('should return original ID for unmapped new columns', () => {
      expect(reverseMigrateColumnId('unknownColumn')).toBe('unknownColumn');
      expect(reverseMigrateColumnId('action')).toBe('action'); // New column in new grid
    });
  });

  describe('getUnmappedColumnIds', () => {
    test('should identify unmapped column IDs', () => {
      const colIds = ['name', 'ragStatus', 'unknownField1', 'totalCost', 'unknownField2'];
      const unmapped = getUnmappedColumnIds(colIds);

      expect(unmapped).toEqual(['unknownField1', 'unknownField2']);
    });

    test('should return empty array when all IDs are mapped', () => {
      const colIds = ['name', 'ragStatus', 'totalCost'];
      const unmapped = getUnmappedColumnIds(colIds);

      expect(unmapped).toEqual([]);
    });
  });

  describe('getMigrationStats', () => {
    test('should provide accurate migration statistics', () => {
      const colIds = ['name', 'ragStatus', 'unknownField1', 'totalCost', 'unknownField2'];
      const stats = getMigrationStats(colIds);

      expect(stats.total).toBe(5);
      expect(stats.mapped).toBe(3);
      expect(stats.unmapped).toBe(2);
      expect(stats.unmappedIds).toEqual(['unknownField1', 'unknownField2']);
    });

    test('should handle all mapped scenario', () => {
      const colIds = ['name', 'ragStatus', 'totalCost'];
      const stats = getMigrationStats(colIds);

      expect(stats.total).toBe(3);
      expect(stats.mapped).toBe(3);
      expect(stats.unmapped).toBe(0);
      expect(stats.unmappedIds).toEqual([]);
    });

    test('should handle all unmapped scenario', () => {
      const colIds = ['unknown1', 'unknown2', 'unknown3'];
      const stats = getMigrationStats(colIds);

      expect(stats.total).toBe(3);
      expect(stats.mapped).toBe(0);
      expect(stats.unmapped).toBe(3);
      expect(stats.unmappedIds).toEqual(['unknown1', 'unknown2', 'unknown3']);
    });
  });

  describe('Migration map consistency', () => {
    test('should have consistent forward and reverse mappings', () => {
      COLUMN_ID_MIGRATION_MAP.forEach(({ oldId, newId }) => {
        expect(COLUMN_ID_MAP.get(oldId)).toBe(newId);
        expect(REVERSE_COLUMN_ID_MAP.get(newId)).toBe(oldId);
      });
    });

    test('should have unique old IDs', () => {
      const oldIds = COLUMN_ID_MIGRATION_MAP.map((entry) => entry.oldId);
      const uniqueOldIds = [...new Set(oldIds)];

      expect(oldIds.length).toBe(uniqueOldIds.length);
    });

    test('should have unique new IDs', () => {
      const newIds = COLUMN_ID_MIGRATION_MAP.map((entry) => entry.newId);
      const uniqueNewIds = [...new Set(newIds)];

      expect(newIds.length).toBe(uniqueNewIds.length);
    });
  });

  describe('Specific field mapping tests', () => {
    test('should map special columns correctly', () => {
      expect(migrateColumnId('ipSelectionCheckbox')).toBe('ipSelectionCheckbox');
    });

    test('should map date fields correctly', () => {
      expect(migrateColumnId('openCreatorDate')).toBe('openCreationDate');
      expect(migrateColumnId('approvedOn')).toBe('lastApprovedDate');
    });

    test('should map F&BM fields correctly', () => {
      expect(migrateColumnId('primaryFbmContact')).toBe('primaryFbm');
      expect(migrateColumnId('secondaryFbmContacts')).toBe('additionalFbms');
    });

    test('should map product field correctly', () => {
      expect(migrateColumnId('portfolioName')).toBe('productName');
    });

    test('should handle unchanged fields', () => {
      const unchangedFields = [
        'shortId',
        'type',
        'state',
        'startDate',
        'endDate',
        'owner',
        'governanceStructure',
        'inPlan',
        'labels',
        'overview',
        'externalId',
      ];

      unchangedFields.forEach((field) => {
        expect(migrateColumnId(field)).toBe(field);
      });
    });
  });
});
