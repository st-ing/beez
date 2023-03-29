const initialState = {
  isNotifyClicked: false,
  isActivityClicked: false,
  isMessagesClicked: false,
  isUserClicked: false,
}
const headerState = (state = initialState,{ type, ...rest }) => {
  switch (type) {
    case 'setHeaderVisible':
      return {...state, ...rest };
    default:
      return state
  }
}
export default headerState;
