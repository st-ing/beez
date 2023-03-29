const initialState = {
    id: '',
    name: '',
    email: '',
    role: '',
    image: '',
    show_video: '',
}
const loginReducer = (state = initialState,{ type, ...rest }) => {
    switch (type) {
        case 'setLogin':
            return {...state, ...rest };
        default:
            return state
    }
}
export default loginReducer;
