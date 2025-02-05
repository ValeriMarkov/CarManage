import { MailKit } from 'mailkit';
import mailKitConfig from '../mailkit.config';

const mailKit = new MailKit(mailKitConfig);

const notificationService = {
    sendNotification: async (to, subject, body) => {
        const message = {
            from: mailKitConfig.defaults.from,
            to,
            subject,
            html: body,
        };

        try {
            await mailKit.send(message);
            console.log('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },
};

export default notificationService;