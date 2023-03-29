const initialState = {
    isLoginVisible: false,
    isRegisterVisible: false,
    isRecoveryVisible: false,
    isPasswordResetVisible: false,
    email:''
}
const modalVisible = (state = initialState,{ type, ...rest }) => {
    switch (type) {
        case 'setModal':
            return {...state, ...rest };
        default:
            return state
    }
}
export default modalVisible;
