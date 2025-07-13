import {
  DateFilterModel,
  ICombinedSimpleModel,
  NumberFilterModel,
  TextFilterModel,
} from 'ag-grid-community';


// Text Filter with two conditions, both are equals type
const textEqualsSwimmingOrEqualsGymnastics: ICombinedSimpleModel<TextFilterModel> = {
  filterType: 'text',
  operator: 'OR',
  conditions: [
    {
      filterType: 'text',
      type: 'equals',
      filter: 'Swimming'
    },
    {
      filterType: 'text',
      type: 'equals',
      filter: 'Gymnastics'
    }
  ]
};

// A filter combining multiple conditions



// Number Filter with two conditions, both are equals type
const numberEquals18OrEquals20: ICombinedSimpleModel<NumberFilterModel> = {
  filterType: 'number',
  operator: 'OR',
  conditions: [
    {
      filterType: 'number',
      type: 'equals',
      filter: 18
    },
    {
      filterType: 'number',
      type: 'equals',
      filter: 20
    }
  ]
};




// Date Filter with two conditions, both are equals type
const dateEquals04OrEquals08: ICombinedSimpleModel<DateFilterModel> = {
  filterType: 'date',
  operator: 'OR',
  conditions: [
    {
      filterType: 'date',
      type: 'equals',
      dateFrom: '2004-08-29'
    },
    {
      filterType: 'date',
      type: 'equals',
      dateFrom: '2008-08-24'
    }
  ]
};


// Multi Filter Model
// Copy Link
// The model for the Multi Filter wraps the models for all the child filters inside it. It has the IMultiFilterModel interface:

// Properties available on the IMultiFilterModel interface.

// filterType
// Copy Link
// 'multi'
// Multi filter type.
// filterModels
// Copy Link
// any[] | null
// Child filter models in the same order as the filters are specified in filterParams.
// The filterType will always be set to 'multi'. The models array is the same length as the number of child filters, containing the models for the child filters in the same order as the filters were specified in the filterParams. Each array entry will either be set to null if the corresponding child filter is not active, or to the current model for the child filter if it is active.

// For example, if the Multi Filter has the default Text Filter and Set Filter, and the Set Filter is active, the Multi Filter model might look something like this:

const filterModel = {
  filterType: 'multi',
  filterModels: [
    null,
    { filterType: 'set', values: ['A', 'B', 'C'] }
  ]
}