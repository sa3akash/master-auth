import { BaseQueue } from "./baseQueue";
import { authWorker } from "./workers/authWorker";
import { emailWorker } from "./workers/emailWorker";

class EmailQueue extends BaseQueue {
  constructor() {
    super("emailQueue");
    this.processJob('sendEmail', 5, emailWorker.addNotificationEmail);
  }

  public sendEmail(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
