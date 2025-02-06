import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../firebase';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return token;
    } else {
        return null;
    }
}

getToken().then((token) => {
    if (token) {
        console.log("Token:", token);
    } else {
        console.log("No token");
    }
}).catch((error) => {
    console.error("Error getting token:", error);
});

export const updateNotificationSettings = (carId, notificationSettingsData) => {
    return async (dispatch) => {
        try {
            const token = await getToken();
            if (!token) {
                console.error('No token provided');
                return;
            }
            const updatedData = {
                ...notificationSettingsData,
                CarId: carId,
                UserId: auth.currentUser.uid,
            };
            axios.put(
                `https://localhost:7025/api/notificationsettings/${carId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then((response) => {
                    dispatch({
                        type: 'UPDATE_NOTIFICATION_SETTINGS',
                        payload: response.data,
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };
};