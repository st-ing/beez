const initialState = {
  ongoing: [],
  finished: [],
  planned: [],
  templates: [],
  calendar: [],
  finishedFetched:false,
  ongoingFetched:false,
  plannedFetched:false,
  templatesFetched:false,
}

const operationState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'setOperations':
      return {...state, ...rest }
    default:
      return state
  }
}
export default operationState;
