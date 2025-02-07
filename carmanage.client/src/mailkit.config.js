import { MailKit } from 'mailkit';

const mailKitConfig = {
    transport: {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
            user: '85353b001@smtp-brevo.com',
            pass: 'cCPFdNw7XsmVpB5J',
        },
    },
    defaults: {
        from: 'carmanageproject@gmail.com',
    },
};

export default mailKitConfig;
