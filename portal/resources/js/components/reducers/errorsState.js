const initialState = {
    errors: ''
}

const errorState = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case 'setErrors':
            return {...state, ...rest }
        case 'removeErrors':
          return _.merge(state,rest);
        default:
            return state
    }
}
export default errorState;
