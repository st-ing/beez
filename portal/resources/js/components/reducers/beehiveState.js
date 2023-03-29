const initialState = {
  beehives: [],
  fetched: false
}

const beehiveState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'setBeehives':
      return {...state, ...rest }
    default:
      return state
  }
}
export default beehiveState;
