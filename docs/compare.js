
  // Assuming hasXOrgAdmin is a variable that would be defined elsewhere in the application
  // For now, we'll define it as a placeholder

// Map current columns to phoenix columns
const columnsToPhoenixColumnsMap = [
  { 
    currentField: 'ipSelectionCheckbox', 
    phoenixField: 'ipSelectionCheckbox', 
    filterDifference: false
  },
  { 
    currentField: 'action', 
    phoenixField: 'action', 
    filterDifference: false
  },
  { 
    currentField: 'title', 
    phoenixField: 'title', 
    filterDifference: false
  },
  { 
    currentField: 'rag', 
    phoenixField: 'rag', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'executionState', 
    phoenixField: 'executionState', 
    filterDifference: false
  },
  { 
    currentField: 'executionOnly', 
    phoenixField: 'executionOnly', 
    filterDifference: false
  },
  { 
    currentField: 'openForTimeEntry', 
    phoenixField: 'openForTimeEntry', 
    filterDifference: false
  },
  { 
    currentField: 'shortId', 
    phoenixField: 'shortId', 
    filterDifference: false
  },
  { 
    currentField: 'type', 
    phoenixField: 'type', 
    filterDifference: false
  },
  { 
    currentField: 'state', 
    phoenixField: 'state', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with extensive predefined values'
  },
  { 
    currentField: 'benefitsReportingLevel', 
    phoenixField: 'benefitsReportingLevel', 
    filterDifference: false
  },
  { 
    currentField: 'businessCase', 
    phoenixField: 'businessCase', 
    filterDifference: false
  },
  { 
    currentField: 'productName', 
    phoenixField: 'productName', 
    filterDifference: false
  },
  { 
    currentField: 'areaProduct', 
    phoenixField: 'areaProduct', 
    filterDifference: false
  },
  { 
    currentField: 'productOwner', 
    phoenixField: 'productOwner', 
    filterDifference: false
  },
  { 
    currentField: 'live2024', 
    phoenixField: 'financials.live2024', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'outlook2024', 
    phoenixField: 'financials.outlook2024', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'budget2024', 
    phoenixField: 'financials.budget2024', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'live2025', 
    phoenixField: 'financials.live2025', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'outlook2025', 
    phoenixField: 'financials.outlook2025', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'budget2025', 
    phoenixField: 'financials.budget2025', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'live2026', 
    phoenixField: 'financials.live2026', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'outlook2026', 
    phoenixField: 'financials.outlook2026', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'budget2026', 
    phoenixField: 'financials.budget2026', 
    filterDifference: false,
    notes: 'Phoenix uses nested field path'
  },
  { 
    currentField: 'startDate', 
    phoenixField: 'startDate', 
    filterDifference: false,
    notes: 'Both use agDateColumnFilter'
  },
  { 
    currentField: 'endDate', 
    phoenixField: 'endDate', 
    filterDifference: false,
    notes: 'Both use agDateColumnFilter'
  },
  { 
    currentField: 'owner', 
    phoenixField: 'owner', 
    filterDifference: false
  },
  { 
    currentField: 'coOwners', 
    phoenixField: 'coOwners', 
    filterDifference: false
  },
  { 
    currentField: 'agreementApprovers', 
    phoenixField: 'agreementApprovers', 
    filterDifference: false
  },
  { 
    currentField: 'collaborators', 
    phoenixField: 'collaborators', 
    filterDifference: false
  },
  { 
    currentField: 'cto', 
    phoenixField: 'cto', 
    filterDifference: false
  },
  { 
    currentField: 'cbt', 
    phoenixField: 'cbt', 
    filterDifference: false
  },
  { 
    currentField: 'sponsor', 
    phoenixField: 'sponsor', 
    filterDifference: false
  },
  { 
    currentField: 'primaryFbm', 
    phoenixField: 'primaryFbm', 
    filterDifference: false
  },
  { 
    currentField: 'additionalFbms', 
    phoenixField: 'additionalFbms', 
    filterDifference: false
  },
  { 
    currentField: 'governanceStructure', 
    phoenixField: 'governanceStructure', 
    filterDifference: true,
    notes: 'Phoenix uses agTextColumnFilter but current likely uses agSetColumnFilter'
  },
  { 
    currentField: 'salesLead', 
    phoenixField: 'salesLead', 
    filterDifference: false
  },
  { 
    currentField: 'quantLead', 
    phoenixField: 'quantLead', 
    filterDifference: false
  },
  { 
    currentField: 'uxLead', 
    phoenixField: 'uxLead', 
    filterDifference: false
  },
  { 
    currentField: 'productLead', 
    phoenixField: 'productLead', 
    filterDifference: false
  },
  { 
    currentField: 'operationsLead', 
    phoenixField: 'operationsLead', 
    filterDifference: false
  },
  { 
    currentField: 'technologyLead', 
    phoenixField: 'technologyLead', 
    filterDifference: false
  },
  { 
    currentField: 'reportingLead', 
    phoenixField: 'reportingLead', 
    filterDifference: false
  },
  { 
    currentField: 'programManager', 
    phoenixField: 'programManager', 
    filterDifference: false
  },
  { 
    currentField: 'l1SponsorOrganization', 
    phoenixField: 'l1SponsorOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'l2SponsorOrganization', 
    phoenixField: 'l2SponsorOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'l3SponsorOrganization', 
    phoenixField: 'l3SponsorOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'l1OwningOrganization', 
    phoenixField: 'l1OwningOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'l2OwningOrganization', 
    phoenixField: 'l2OwningOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'l3OwningOrganization', 
    phoenixField: 'l3OwningOrganization', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  },
  { 
    currentField: 'inPlan', 
    phoenixField: 'inPlan', 
    filterDifference: true,
    notes: 'Current uses agTextColumnFilter while Phoenix uses agSetColumnFilter'
  },
  { 
    currentField: 'labels', 
    phoenixField: 'labels', 
    filterDifference: false,
    notes: 'Both use agTextColumnFilter'
  },
  { 
    currentField: 'milestoneDeliveryTeams', 
    phoenixField: 'milestoneDeliveryTeams', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with extensive predefined values'
  },
  { 
    currentField: 'openCreatorDate', 
    phoenixField: 'openCreationDate', 
    filterDifference: false,
    notes: 'Field name slightly different, both use agDateColumnFilter'
  },
  { 
    currentField: 'openCreatorName', 
    phoenixField: 'openCreatorName', 
    filterDifference: false
  },
  { 
    currentField: 'overview', 
    phoenixField: 'overview', 
    filterDifference: false
  },
  { 
    currentField: 'benefitsSummary', 
    phoenixField: 'benefitsSummary', 
    filterDifference: false
  },
  { 
    currentField: 'regionalImpact', 
    phoenixField: 'regionalImpact', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with extensive predefined values'
  },
  { 
    currentField: 'approvedOn', 
    phoenixField: 'lastApprovedDate', 
    filterDifference: false,
    notes: 'Field name different, both use agDateColumnFilter'
  },
  { 
    currentField: 'externalId', 
    phoenixField: 'externalId', 
    filterDifference: false
  },
  { 
    currentField: 'lumaPhase', 
    phoenixField: 'lumaPhase', 
    filterDifference: false,
    notes: 'Phoenix uses agSetColumnFilter with predefined values'
  }
];


// Notes shortId, businessCase, productName, productOwner, Owner, CoOwners, agreementApprovers, collaborators, cto, cbt, sponsor, primaryFbm, additionalFbms, salesLead, quantLead, uxLead, productLead, operationsLead, technologyLead, reportingLead, programManager, labels, externalId

