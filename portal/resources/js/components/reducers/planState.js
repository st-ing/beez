const initialState = {
  plans: [],
  fetched: false,
  plansTemplates:[],
  plansTemplatesFetched:false
}

const planState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'setPlans':
      return {...state, ...rest }
    default:
      return state
  }
}
export default planState;
