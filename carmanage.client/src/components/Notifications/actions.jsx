import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const getToken = async () => {
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
    } else {
        console.warn('No authenticated user found.');
        return null;
    }
};

export const updateNotificationSettings = (carId, notificationSettingsData) => {
    return async (dispatch) => {
        try {
            console.log("Attempting to update notification settings...");

            const token = await getToken();
            if (!token) {
                console.error('No token provided. Aborting request.');
                return;
            }

            const updatedData = {
                ...notificationSettingsData,
                CarId: carId,
                UserId: auth.currentUser ? auth.currentUser.uid : null,
            };

            console.log("Sending Notification Settings Payload:", updatedData);

            const response = await axios.put(
                `https://localhost:7025/api/notificationsettings/${carId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Successfully updated notification settings. Server response:", response.data);

            dispatch({
                type: 'UPDATE_NOTIFICATION_SETTINGS',
                payload: response.data,
            });
        } catch (error) {
            console.error("Error updating notification settings:", error.response ? error.response.data : error.message);
        }
    };
};
