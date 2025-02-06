const sendNotification = async (email, subject, message) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const response = await fetch("https://localhost:7025/api/email/send", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ email, subject, message }),
        });

        if (response.status === 401) {
            throw new Error("Unauthorized - No token provided.");
        }

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // re-throw the error so it can be caught by the caller
    }
};

export default { sendNotification };