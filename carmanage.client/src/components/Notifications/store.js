import { createStore, combineReducers } from 'redux';
import notificationSettingsReducer from './reducers';

const rootReducer = combineReducers({
    notificationSettings: notificationSettingsReducer
});

const store = createStore(rootReducer);

export default store;