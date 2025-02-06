const sendNotification = async (email, subject, message) => {
    try {
        const response = await fetch("https://localhost:5001/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, subject, message }),
        });

        if (!response.ok) {
            throw new Error("Failed to send email");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default { sendNotification };
