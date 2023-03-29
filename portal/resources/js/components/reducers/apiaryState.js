const initialState = {
  apiaries: [],
  fetched: false
}

const apiaryState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'setApiaries':
      return {...state, ...rest }
    default:
      return state
  }
}
export default apiaryState;
