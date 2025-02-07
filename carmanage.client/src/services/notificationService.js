import axios from 'axios';

export const sendNotification = async (email, subject, message) => {
    try {
        const response = await axios.post(
            'https://localhost:7025/api/email/send',
            { email, subject, message },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        console.log("Email sent successfully:", response.data);
        return response.data; // Fixes "response is not defined" error
    } catch (error) {
        console.error("Error sending email:", error.response ? error.response.data : error.message);
        throw error;
    }
};
