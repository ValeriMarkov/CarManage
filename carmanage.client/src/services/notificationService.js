import axios from 'axios';
import { auth } from '../firebase';

const sendNotification = async (email, subject, message) => {
    try {
        if (!auth.currentUser) {
            throw new Error('No user is authenticated');
        }
        const token = await auth.currentUser.getIdToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const axiosInstance = axios.create({
            headers: headers,
        });

        const response = await axiosInstance.post(
            'https://localhost:7025/api/email/send',
            { email, subject, message }
        );

        if (response.status === 401) {
            throw new Error('Unauthorized - No token provided.');
        }

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default { sendNotification };