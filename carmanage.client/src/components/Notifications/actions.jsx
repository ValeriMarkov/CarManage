export const updateNotificationSettings = (carId, notificationSettingsData) => {
    return dispatch => {
        axios.put(`/api/notificationsettings/${carId}`, notificationSettingsData)
            .then(response => {
                dispatch({
                    type: 'UPDATE_NOTIFICATION_SETTINGS',
                    payload: response.data
                });
            })
            .catch(error => {
                console.error(error);
            });
    };
};