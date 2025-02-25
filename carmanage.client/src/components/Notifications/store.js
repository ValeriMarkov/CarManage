import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import notificationSettingsReducer from './reducers';

const rootReducer = combineReducers({
    notificationSettings: notificationSettingsReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;