import { createStore,applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk';
import allReducers from './reducers';

const store = createStore(allReducers, applyMiddleware(ReduxThunk));

export default store
