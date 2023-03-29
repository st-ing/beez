const initialState = {
    language: localStorage.getItem('i18nextLng') || 'en',
    initialized:false
}
const localization = (state = initialState,{ type, ...rest }) => {
    switch (type) {
        case 'setLanguage':
            return {...state, ...rest };
        default:
            return state
    }
}
export default localization;
