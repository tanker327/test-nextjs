/**
 * Column ID Migration Mapping
 *
 * Maps old grid column IDs/fields to new grid column IDs/fields.
 * Based on analysis of old-grid-definition.js vs new-grid-definition.js
 *
 * Key changes identified:
 * 1. Field name changes (name → title, ragStatus → rag)
 * 2. Financial fields moved to namespaced structure (totalCost → financials.live2025)
 * 3. Simplified field names (chiefTechnologyOfficer → cto, sponsors → sponsor)
 * 4. Some fields use different property names for lead roles
 * 5. Organization field name changes (l1SponsoringOrganization → l1SponsorOrganization)
 */

export interface ColumnMigrationEntry {
  oldId: string;
  newId: string;
  description?: string;
}

/**
 * Column ID migration mapping from old grid to new grid format
 */
export const COLUMN_ID_MIGRATION_MAP: ColumnMigrationEntry[] = [
  // Special columns - selection checkbox migration
  {
    oldId: 'msSelectionCheckbox',
    newId: 'ipSelectionCheckbox',
    description: 'Selection checkbox column (ms → ip)',
  },

  // New action column (doesn't exist in old grid)
  // Note: No mapping needed as this is new

  // Basic field mappings
  {
    oldId: 'name',
    newId: 'title',
    description: 'Title field renamed',
  },
  {
    oldId: 'ragStatus',
    newId: 'rag',
    description: 'RAG status field simplified',
  },
  {
    oldId: 'executionState',
    newId: 'executionState',
    description: 'Execution state unchanged',
  },
  {
    oldId: 'isExecutionOnly',
    newId: 'executionOnly',
    description: 'Execution only field simplified (removed "is" prefix)',
  },
  {
    oldId: 'isOpenForTimeEntry',
    newId: 'openForTimeEntry',
    description: 'Open for time entry field simplified (removed "is" prefix)',
  },
  {
    oldId: 'shortId',
    newId: 'shortId',
    description: 'Short ID unchanged',
  },
  {
    oldId: 'type',
    newId: 'type',
    description: 'Type unchanged',
  },
  {
    oldId: 'state',
    newId: 'state',
    description: 'State unchanged',
  },
  {
    oldId: 'benefitsReportingLevel',
    newId: 'benefitsReportingLevel',
    description: 'Benefits reporting level unchanged',
  },
  {
    oldId: 'businessCase',
    newId: 'businessCase',
    description: 'Business case unchanged (note: piBusinessCase was removed)',
  },
  {
    oldId: 'portfolioName',
    newId: 'productName',
    description: 'Portfolio name changed to product name',
  },
  {
    oldId: 'areaProduct',
    newId: 'areaProduct',
    description: 'Area product unchanged',
  },
  {
    oldId: 'productOwner',
    newId: 'productOwner',
    description: 'Product owner unchanged',
  },

  // Financial fields - moved to namespaced structure
  // Previous year (2024 in old grid, assuming current year was 2025)
  {
    oldId: 'totalCostPreviousYear',
    newId: 'financials.live2024',
    description: 'Previous year live plan moved to financials namespace',
  },
  {
    oldId: 'forecastTotalCostPreviousYear',
    newId: 'financials.outlook2024',
    description: 'Previous year outlook moved to financials namespace',
  },
  {
    oldId: 'budgetTotalCostPreviousYear',
    newId: 'financials.budget2024',
    description: 'Previous year budget moved to financials namespace',
  },

  // Current year (2025 in old grid)
  {
    oldId: 'totalCost',
    newId: 'financials.live2025',
    description: 'Current year live plan moved to financials namespace',
  },
  {
    oldId: 'forecastTotalCost',
    newId: 'financials.outlook2025',
    description: 'Current year outlook moved to financials namespace',
  },
  {
    oldId: 'budgetTotalCost',
    newId: 'financials.budget2025',
    description: 'Current year budget moved to financials namespace',
  },

  // Next year (2026 in old grid)
  {
    oldId: 'totalCostNextYear',
    newId: 'financials.live2026',
    description: 'Next year live plan moved to financials namespace',
  },
  {
    oldId: 'forecastTotalCostNextYear',
    newId: 'financials.outlook2026',
    description: 'Next year outlook moved to financials namespace',
  },
  {
    oldId: 'budgetTotalCostNextYear',
    newId: 'financials.budget2026',
    description: 'Next year budget moved to financials namespace',
  },

  // Date fields
  {
    oldId: 'startDate',
    newId: 'startDate',
    description: 'Start date unchanged',
  },
  {
    oldId: 'endDate',
    newId: 'endDate',
    description: 'End date unchanged',
  },

  // People/Role fields
  {
    oldId: 'owner',
    newId: 'owner',
    description: 'Owner unchanged',
  },
  {
    oldId: 'coOwners',
    newId: 'coOwners',
    description: 'Co-owners unchanged',
  },
  {
    oldId: 'agreementApprovers',
    newId: 'agreementApprovers',
    description: 'Agreement approvers unchanged',
  },
  {
    oldId: 'collaborators',
    newId: 'collaborators',
    description: 'Collaborators unchanged',
  },
  {
    oldId: 'chiefTechnologyOfficer',
    newId: 'cto',
    description: 'Chief Technology Officer simplified to CTO',
  },
  {
    oldId: 'chiefBusinessTechnologist',
    newId: 'cbt',
    description: 'Chief Business Technologist simplified to CBT',
  },
  {
    oldId: 'sponsors',
    newId: 'sponsor',
    description: 'Sponsors changed to singular sponsor',
  },
  {
    oldId: 'primaryFbmContact',
    newId: 'primaryFbm',
    description: 'Primary F&BM contact simplified',
  },
  {
    oldId: 'secondaryFbmContacts',
    newId: 'additionalFbms',
    description: 'Secondary F&BM contacts changed to additional F&BMs',
  },
  {
    oldId: 'governanceStructure',
    newId: 'governanceStructure',
    description: 'Governance structure unchanged',
  },

  // Lead roles - changed from plural to singular
  {
    oldId: 'salesLeads',
    newId: 'salesLead',
    description: 'Sales leads changed to singular',
  },
  {
    oldId: 'quantLeads',
    newId: 'quantLead',
    description: 'Quant leads changed to singular',
  },
  {
    oldId: 'uxLeads',
    newId: 'uxLead',
    description: 'UX leads changed to singular',
  },
  {
    oldId: 'productLeads',
    newId: 'productLead',
    description: 'Product leads changed to singular',
  },
  {
    oldId: 'operationsLead',
    newId: 'operationsLead',
    description: 'Operations lead unchanged (already singular)',
  },
  {
    oldId: 'technologyLead',
    newId: 'technologyLead',
    description: 'Technology lead unchanged',
  },
  {
    oldId: 'reportingLead',
    newId: 'reportingLead',
    description: 'Reporting lead unchanged',
  },
  {
    oldId: 'programManager',
    newId: 'programManager',
    description: 'Program manager unchanged',
  },

  // Organization fields - naming changes
  {
    oldId: 'l1SponsoringOrganization',
    newId: 'l1SponsorOrganization',
    description: 'L1 sponsoring organization field name simplified',
  },
  {
    oldId: 'l2SponsoringOrganization',
    newId: 'l2SponsorOrganization',
    description: 'L2 sponsoring organization field name simplified',
  },
  {
    oldId: 'l3SponsoringOrganization',
    newId: 'l3SponsorOrganization',
    description: 'L3 sponsoring organization field name simplified',
  },
  {
    oldId: 'l1OwningOrganization',
    newId: 'l1OwningOrganization',
    description: 'L1 owning organization unchanged',
  },
  {
    oldId: 'l2OwningOrganization',
    newId: 'l2OwningOrganization',
    description: 'L2 owning organization unchanged',
  },
  {
    oldId: 'l3OwningOrganization',
    newId: 'l3OwningOrganization',
    description: 'L3 owning organization unchanged',
  },

  // Other fields
  {
    oldId: 'inPlan',
    newId: 'inPlan',
    description: 'In plan unchanged',
  },
  {
    oldId: 'labels',
    newId: 'labels',
    description: 'Labels unchanged',
  },
  {
    oldId: 'milestoneDeliveryTeams',
    newId: 'milestoneDeliveryTeams',
    description: 'Milestone delivery teams unchanged',
  },
  {
    oldId: 'openCreatorDate',
    newId: 'openCreationDate',
    description: 'Open creator date changed to open creation date',
  },
  {
    oldId: 'openCreatorName',
    newId: 'openCreatorName',
    description: 'Open creator name unchanged',
  },
  {
    oldId: 'overview',
    newId: 'overview',
    description: 'Overview unchanged',
  },
  {
    oldId: 'benefitsSummary',
    newId: 'benefitsSummary',
    description: 'Benefits summary unchanged',
  },
  {
    oldId: 'regionalImpact',
    newId: 'regionalImpact',
    description: 'Regional impact unchanged',
  },
  {
    oldId: 'approvedOn',
    newId: 'lastApprovedDate',
    description: 'Approved on changed to last approved date',
  },
  {
    oldId: 'externalId',
    newId: 'externalId',
    description: 'External ID unchanged',
  },
  {
    oldId: 'lumaPhase',
    newId: 'lumaPhase',
    description: 'Luma phase unchanged',
  },
];

/**
 * Creates a map for quick lookup of old ID to new ID
 */
export const COLUMN_ID_MAP = new Map<string, string>(
  COLUMN_ID_MIGRATION_MAP.map((entry) => [entry.oldId, entry.newId]),
);

/**
 * Creates a reverse map for quick lookup of new ID to old ID
 */
export const REVERSE_COLUMN_ID_MAP = new Map<string, string>(
  COLUMN_ID_MIGRATION_MAP.map((entry) => [entry.newId, entry.oldId]),
);

/**
 * Migrates a column ID from old format to new format
 * @param oldColId - The old column ID
 * @returns The new column ID, or the original ID if no mapping exists
 */
export function migrateColumnId(oldColId: string): string {
  return COLUMN_ID_MAP.get(oldColId) || oldColId;
}

/**
 * Migrates an array of column IDs from old format to new format
 * @param oldColIds - Array of old column IDs
 * @returns Array of new column IDs
 */
export function migrateColumnIds(oldColIds: string[]): string[] {
  return oldColIds.map(migrateColumnId);
}

/**
 * Reverse migrates a column ID from new format to old format
 * @param newColId - The new column ID
 * @returns The old column ID, or the original ID if no mapping exists
 */
export function reverseMigrateColumnId(newColId: string): string {
  return REVERSE_COLUMN_ID_MAP.get(newColId) || newColId;
}

/**
 * Gets all unmapped column IDs from a list (useful for debugging)
 * @param colIds - Array of column IDs to check
 * @returns Array of column IDs that don't have mappings
 */
export function getUnmappedColumnIds(colIds: string[]): string[] {
  return colIds.filter((id) => !COLUMN_ID_MAP.has(id));
}

/**
 * Gets migration statistics for a list of column IDs
 * @param oldColIds - Array of old column IDs
 * @returns Statistics about the migration
 */
export function getMigrationStats(oldColIds: string[]): {
  total: number;
  mapped: number;
  unmapped: number;
  unmappedIds: string[];
} {
  const unmappedIds = getUnmappedColumnIds(oldColIds);
  return {
    total: oldColIds.length,
    mapped: oldColIds.length - unmappedIds.length,
    unmapped: unmappedIds.length,
    unmappedIds,
  };
}
