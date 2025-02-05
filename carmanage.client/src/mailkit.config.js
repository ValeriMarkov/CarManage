import { MailKit } from 'mailkit';

const mailKitConfig = {
transport: {
host: 'smtp.gmail.com',
port: 587,
secure: false,
auth: {
user: 'carmanageproject@gmail.com',
pass: 'Carmanageproject1!',
},
},
defaults: {
	from: 'carmanageproject@gmail.com',
},
};

export default mailKitConfig;