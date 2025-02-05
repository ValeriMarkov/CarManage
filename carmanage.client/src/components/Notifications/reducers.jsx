const initialState = {
    notificationSettings: {}
};

const notificationSettingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_NOTIFICATION_SETTINGS':
            return {
                ...state,
                notificationSettings: action.payload
            };
        default:
            return state;
    }
};

export default notificationSettingsReducer;