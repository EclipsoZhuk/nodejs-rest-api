import Mailgen from 'mailgen';

class EmailService {
    constructor(env, sender) {
        this.sender = sender;
        switch (env) {
            case 'development':
                this.link = 'https://c264-109-87-177-122.ngrok.io';
                break;
            case 'test':
                this.link = 'http://localhost:5000';
                break;
            case 'production':
                this.link = 'https://eclipsozhuk-api.herokuapp.com';
                break;
            default:
                this.link = 'http://localhost:8081';
        }
    }

    createEmailTemplate(username, verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'EclipsoZhuk',
                link: this.link,
            },
        });

        const email = {
            body: {
                name: username,
                intro: "Welcome! We're very excited to have you on board.",
                action: {
                    instructions:
                        'To get started with our API, please click here:',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Confirm your account',
                        link: `${this.link}/users/verify/${verifyToken}`,
                    },
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
            },
        };
        return mailGenerator.generate(email);
    }

    async sendVerifyEmail(email, username, verifyToken) {
        const emailBody = this.createEmailTemplate(username, verifyToken);
        const msg = {
            to: email,
            subject: 'Verify email',
            html: emailBody,
        };
        try {
            const result = await this.sender.send(msg);
            console.log(result);
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }
}

export default EmailService;
