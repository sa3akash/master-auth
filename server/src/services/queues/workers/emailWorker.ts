import { authService } from "@services/db/authService";
import { mailTransport } from "@services/mailers/mailTransporter";
import { emailTemplates } from "@services/mailers/templates";
import { DoneCallback, Job } from "bull";
import { emailQueue } from "../emailQueue";

class EmailWorker {
  async addNotificationEmail(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { receiverEmail, template, subject } = job.data;
      // save data in db
      await mailTransport.sendMail(receiverEmail, subject, template);
      // add method to save data in db
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
  async sendVerificationEmail(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { id } = job.data;
      // save data in db
      const user = await authService.getUserById(id);
      const verificationDoc = await authService.createVerification({
        userId: `${id}`,
      });
      // test email
      const template: string = emailTemplates.emailWithCode(
        verificationDoc.code
      );

      emailQueue.sendEmail("sendEmail", {
        receiverEmail: user?.email,
        template,
        subject: "Email Verification Code",
      });
      // add method to save data in db
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
  async sendVerification2FA(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { id } = job.data;
      // save data in db
      const user = await authService.getUserById(id);
      const verificationDoc = await authService.createVerification({
        userId: `${id}`,
      });
      // test email
      const template: string = emailTemplates.twoFaVerification(
        verificationDoc.code
      );

      emailQueue.sendEmail("sendEmail", {
        receiverEmail: user?.email,
        template,
        subject: "Your 2FA Verification Code",
      });
      // add method to save data in db
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
