import { config } from "@root/config";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

class MailTransport {
  public async sendMail(receiverEmail: string, subject: string, template: string) {
    const mailOptions: Mail.Options = {
      from: '"SA2 🔥" <sa2@social.com>',
      to: receiverEmail,
      subject: subject,
      html: template,
    };

    await this.emailSender(mailOptions);
  }

  private async emailSender(mailOptions: Mail.Options) {
    const transporter: Mail = nodemailer.createTransport({
      host: config.SENDER_EMAIL_HOST,
      port: Number(config.SENDER_EMAIL_PORT),
      secure: config.NODE_ENV !== "development",
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.log(error);
    }
  }
}

export const mailTransport = new MailTransport();