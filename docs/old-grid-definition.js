
  export const columns = [
    {
      headerCheckboxSelection: hasXOrgAdmin,
      checkboxSelection: function(params) { return !params.node.footer; },
      colId: 'ipSelectionCheckbox',
      headerCheckboxSelectionFilteredOnly: true,
      lockPosition: 'left',
      maxWidth: 50,
      minWidth: 50,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true,
      suppressExcelExport: true,
      lockVisible: true
    },
    {
      headerName: 'Title',
      field: 'name',
      filter: 'agTextColumnFilter',
      initialWidth: 250
    },
    {
      headerName: 'RAG',
      field: 'ragStatus',
      initialWidth: 150,
      cellRenderer: vanillaBadgeRenderer,
      cellRendererParams: params => ({
        badgeType: getTuxBadgeType(Column.Rag, params.value),
        badgeStyle: '',
        value: getRagValue(params)
      })
    },
    {
      headerName: 'Execution State',
      field: 'executionState',
      initialWidth: 200
    },
    {
      headerName: 'Execution Only',
      field: 'isExecutionOnly',
      initialWidth: 190,
      valueGetter: params => params.data ? getFlagValue(params.data.isExecutionOnly) : ''
    },
    {
      headerName: 'Open For Time Entry',
      field: 'isOpenForTimeEntry',
      initialWidth: 230,
      valueGetter: params => params.data ? getFlagValue(params.data.isOpenForTimeEntry) : ''
    },
    {
      headerName: 'Short ID',
      field: 'shortId',
      initialWidth: 150
    },
    {
      headerName: 'Type',
      field: 'type',
      initialWidth: 130
    },
    {
      headerName: 'State',
      field: 'state',
      initialWidth: 130,
      cellRenderer: vanillaBadgeRenderer,
      cellRendererParams: (params) => ({
        badgeType: getTuxBadgeType(Column.State, params.value),
        badgeStyle: 'display:inline-block'
      }),
      valueGetter: params => params.data && params.data.state ? params.data.state.name : '',
      filterParams: { suppressAndOrCondition: true }
    },
    {
      headerName: 'Benefits Reporting Level',
      field: 'benefitsReportingLevel',
      initialWidth: 220,
      valueGetter: params => params.data && params.data.benefitsReportingLevel ? params.data.benefitsReportingLevel : ''
    },
    {
      headerName: 'Mii Business Case',
      field: 'businessCase',
      initialWidth: 180,
      filterParams: { suppressAndOrCondition: true },
      valueGetter: params => params.data ? params.data.businessCase ? params.data.businessCase.label : '' : ''
    },
    {
      headerName: 'Business Case',
      field: 'piBusinessCase',
      initialWidth: 180,
      filterParams: { suppressAndOrCondition: true },
      valueGetter: params => params.data ? params.data.piBusinessCase ? params.data.piBusinessCase.label : '' : ''
    },
    {
      headerName: 'Product Name',
      field: 'portfolioName',
      initialWidth: 185
    },
    {
      headerName: 'Area Product',
      field: 'areaProduct',
      initialWidth: 180,
      valueGetter: params => params.data && params.data.product && params.data.product.areaProducts ? params.data.product.areaProducts.name : ''
    },
    {
      headerName: 'Product Owner',
      field: 'productOwner',
      initialWidth: 180,
      valueGetter: params => params.data && params.data.product && params.data.product.productOwner ? getReferenceValue(params.data.product.productOwner, { valueReference: 'account' }) : ''
    },
    {
      headerName: (currentYear - 1) + ' Live Plan',
      valueGetter: params => params.data ? (params.data.totalCostPreviousYear ? params.data.totalCostPreviousYear : 0) : 0,
      field: 'totalCostPreviousYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 185,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'totalCostPreviousYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: (currentYear - 1) + ' Outlook',
      valueGetter: params => params.data ? (params.data.forecastTotalCostPreviousYear ? params.data.forecastTotalCostPreviousYear : 0) : 0,
      field: 'forecastTotalCostPreviousYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'forecastTotalCostPreviousYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: (currentYear - 1) + ' Budget',
      valueGetter: params => params.data ? (params.data.budgetTotalCostPreviousYear ? params.data.budgetTotalCostPreviousYear : 0) : 0,
      field: 'budgetTotalCostPreviousYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'budgetTotalCostPreviousYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: currentYear + ' Live Plan',
      valueGetter: params => params.data ? (params.data.totalCost ? params.data.totalCost : 0) : 0,
      field: 'totalCost',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 185,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'totalCost'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: currentYear + ' Outlook',
      valueGetter: params => params.data ? (params.data.forecastTotalCost ? params.data.forecastTotalCost : 0) : 0,
      field: 'forecastTotalCost',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'forecastTotalCost'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: currentYear + ' Budget',
      valueGetter: params => params.data ? (params.data.budgetTotalCost ? params.data.budgetTotalCost : 0) : 0,
      field: 'budgetTotalCost',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'budgetTotalCost'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: (currentYear + 1) + ' Live Plan',
      valueGetter: params => params.data ? (params.data.totalCostNextYear ? params.data.totalCostNextYear : 0) : 0,
      field: 'totalCostNextYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 185,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'totalCostNextYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: (currentYear + 1) + ' Outlook',
      valueGetter: params => params.data ? (params.data.forecastTotalCostNextYear ? params.data.forecastTotalCostNextYear : 0) : 0,
      field: 'forecastTotalCostNextYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'forecastTotalCostNextYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: (currentYear + 1) + ' Budget',
      valueGetter: params => params.data ? (params.data.budgetTotalCostNextYear ? params.data.budgetTotalCostNextYear : 0) : 0,
      field: 'budgetTotalCostNextYear',
      comparator: numberComparator,
      filterParams: {
        comparator: numberComparator,
        filterOptions: ['equals', 'notEqual'],
        suppressAndOrCondition: true
      },
      initialWidth: 180,
      cellClass: 'align-right',
      valueFormatter: params => this.formatCost(params, 'budgetTotalCostNextYear'),
      enableValue: true,
      defaultAggFunc: 'costSum'
    },
    {
      headerName: 'Start Date',
      field: 'startDate',
      comparator: dateComparator,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterComparator },
      initialWidth: 160,
      valueGetter: params => params.data ? params.data.startDate ? parseGraphQlDate(params.data.startDate) : null : null,
      cellClass: 'customDate'
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      comparator: dateComparator,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterComparator },
      initialWidth: 150,
      valueGetter: params => params.data ? params.data.endDate ? parseGraphQlDate(params.data.endDate) : null : null,
      cellClass: 'customDate'
    },
    {
      headerName: 'Owner',
      field: 'owner',
      initialWidth: 150,
      valueGetter: params => params.data ? params.data.owner ? getReferenceValue(params.data.owner, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'Co-Owners',
      field: 'coOwners',
      initialWidth: 170,
      valueGetter: params => params.data ? params.data.coOwners ? params.data.coOwners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Agreement Approvers',
      field: 'agreementApprovers',
      initialWidth: 240,
      valueGetter: params => params.data ? params.data.agreementApprovers ? params.data.agreementApprovers.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Collaborators',
      field: 'collaborators',
      initialWidth: 180,
      valueGetter: params => params.data ? params.data.collaborators ? params.data.collaborators.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'CTO',
      field: 'chiefTechnologyOfficer',
      initialWidth: 130,
      valueGetter: params => params.data ? params.data.chiefTechnologyOfficer ? getReferenceValue(params.data.chiefTechnologyOfficer, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'CBT',
      field: 'chiefBusinessTechnologist',
      initialWidth: 130,
      valueGetter: params => params.data ? params.data.chiefBusinessTechnologist ? getReferenceValue(params.data.chiefBusinessTechnologist, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'Sponsor',
      field: 'sponsors',
      initialWidth: 150,
      valueGetter: params => params.data ? params.data.sponsors ? params.data.sponsors.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Primary F&BM',
      field: 'primaryFbmContact',
      initialWidth: 190,
      valueGetter: params => params.data ? params.data.primaryFbmContact ? getReferenceValue(params.data.primaryFbmContact, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'Additional F&BMs',
      field: 'secondaryFbmContacts',
      initialWidth: 210,
      valueGetter: params => params.data ? params.data.secondaryFbmContacts ? params.data.secondaryFbmContacts.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Governance Structure',
      field: 'governanceStructure',
      initialWidth: 230
    },
    {
      headerName: 'Sales Lead',
      field: 'salesLeads',
      initialWidth: 180,
      valueGetter: params => params.data ? params.data.salesLeads ? params.data.salesLeads.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Quant Lead',
      field: 'quantLeads',
      initialWidth: 180,
      valueGetter: params => params.data ? params.data.quantLeads ? params.data.quantLeads.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Ux Lead',
      field: 'uxLeads',
      initialWidth: 180,
      valueGetter: params => params.data ? params.data.uxLeads ? params.data.uxLeads.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Product Lead',
      field: 'productLeads',
      initialWidth: 180,
      valueGetter: params => params.data ? params.data.productLeads ? params.data.productLeads.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Operations Lead',
      field: 'operationsLead',
      initialWidth: 200,
      valueGetter: params => params.data ? params.data.operationsLead ? params.data.operationsLead.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Technology Lead',
      field: 'technologyLead',
      initialWidth: 200,
      valueGetter: params => params.data ? params.data.technologyLead ? getReferenceValue(params.data.technologyLead, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'Reporting Lead',
      field: 'reportingLead',
      initialWidth: 200,
      valueGetter: params => params.data ? params.data.reportingLead ? params.data.reportingLead.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'Program Manager',
      field: 'programManager',
      initialWidth: 210,
      valueGetter: params => params.data ? params.data.programManager ? params.data.programManager.owners.map(s => getReferenceValue(s, { valueReference: 'account' })).join(' | ') : '' : ''
    },
    {
      headerName: 'L1 Sponsor Organization',
      field: 'l1SponsoringOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l1SponsoringOrganization ? params.data.l1SponsoringOrganization.name : ''
    },
    {
      headerName: 'L2 Sponsor Organization',
      field: 'l2SponsoringOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l2SponsoringOrganization ? params.data.l2SponsoringOrganization.name : ''
    },
    {
      headerName: 'L3 Sponsor Organization',
      field: 'l3SponsoringOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l3SponsoringOrganization ? params.data.l3SponsoringOrganization.name : ''
    },
    {
      headerName: 'L1 Owning Organization',
      field: 'l1OwningOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l1OwningOrganization ? params.data.l1OwningOrganization.name : ''
    },
    {
      headerName: 'L2 Owning Organization',
      field: 'l2OwningOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l2OwningOrganization ? params.data.l2OwningOrganization.name : ''
    },
    {
      headerName: 'L3 Owning Organization',
      field: 'l3OwningOrganization',
      initialWidth: 250,
      valueGetter: params => params.data && params.data.l3OwningOrganization ? params.data.l3OwningOrganization.name : ''
    },
    {
      headerName: 'In Plan',
      field: 'inPlan',
      initialWidth: 140,
      filter: 'agTextColumnFilter',
      valueGetter: params => params.data ? getFlagValue(params.data.inPlan) : ''
    },
    {
      headerName: 'Labels',
      field: 'labels',
      filter: 'agTextColumnFilter',
      initialWidth: 140,
      valueGetter: params => params.data ? params.data.labels ? params.data.labels.map(label => label.value).join(', ') : '' : ''
    },
    {
      headerName: 'Milestone Delivery Teams',
      field: 'milestoneDeliveryTeams',
      initialWidth: 260
    },
    {
      headerName: 'Open Creation Date',
      field: 'openCreatorDate',
      comparator: dateComparator,
      initialWidth: 220,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterComparator },
      valueGetter: params => params.data ? params.data.openCreatorDate ? parseGraphQlDate(params.data.openCreatorDate) : null : null,
      cellClass: 'customDate'
    },
    {
      headerName: 'Open Creator Name',
      field: 'openCreatorName',
      initialWidth: 220,
      valueGetter: params => params.data ? params.data.openCreatorName ? getReferenceValue(params.data.openCreatorName, { valueReference: 'account' }) : '' : ''
    },
    {
      headerName: 'Overview',
      field: 'overview',
      filter: 'agTextColumnFilter',
      initialWidth: 250,
      valueGetter: params => params.data ? params.data && params.data.overview ? getValidData(params.data.overview) : '' : ''
    },
    {
      headerName: 'Benefits Summary',
      field: 'benefitsSummary',
      filter: 'agTextColumnFilter',
      initialWidth: 250,
      valueGetter: params => params.data ? params.data && params.data.benefitsSummary ? getValidData(params.data.benefitsSummary) : '' : ''
    },
    {
      headerName: 'Regional Impact',
      field: 'regionalImpact',
      initialWidth: 200,
      valueGetter: params => params.data ? params.data.regionalImpact ? params.data.regionalImpact.map(s => s.region.name).join(' | ') : '' : ''
    },
    {
      headerName: 'Last Approved Date',
      field: 'approvedOn',
      initialWidth: 220,
      comparator: dateComparator,
      filter: 'agDateColumnFilter',
      filterParams: { comparator: dateFilterComparator },
      valueGetter: params => params.data ? params.data.approvedOn ? parseGraphQlDate(params.data.approvedOn) : null : null,
      cellClass: 'customDate'
    },
    {
      headerName: 'External ID',
      field: 'externalId',
      initialWidth: 150
    },
    {
      headerName: 'Luma Phase',
      field: 'lumaPhase',
      initialWidth: 130
    }
];
  

 