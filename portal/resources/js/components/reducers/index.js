import {combineReducers} from 'redux';
import loginReducer from "./loginReducer";
import changeState from "./changeState";
import modalVisible from "./modalVisible";
import localization from "./localization";
import errorState from "./errorsState";
import apiaryState from "./apiaryState";
import beehiveState from "./beehiveState";
import planState from "./planState";
import operationState from "./operationState";
import headerState from "./headerState";
const allReducers = combineReducers({
    userLogged: loginReducer,
    sidebarShow: changeState,
    modalShow: modalVisible,
    localization:localization,
    errorState:errorState,
    apiaryState:apiaryState,
    beehiveState:beehiveState,
    planState:planState,
    operationState:operationState,
    headerState:headerState
})
export default allReducers;
