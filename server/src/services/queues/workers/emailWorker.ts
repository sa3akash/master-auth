import { mailTransport } from '@services/mailers/mailTransporter';
import { DoneCallback, Job } from 'bull';

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
}

export const emailWorker: EmailWorker = new EmailWorker();