import userModel from "@models/userModel";
import { authService } from "@services/db/authService";
import { emailTemplates } from "@services/mailers/templates";
import { DoneCallback, Job } from "bull";
import { emailQueue } from "../emailQueue";
import verificationModel from "@models/verificationModel";
import { VerificationEnum } from "@services/interfaces/enum";

class AuthWorker {
  public async registerUser(job: Job, done: DoneCallback): Promise<void> {
    try {
      const data = job.data as {
        email: string;
        name: string;
        password: string;
      };

      const newUser = await authService.createUser(data);

      emailQueue.sendVerificationCode("sendVerificationCode", {
        id: `${newUser?._id}`,
      });

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
  public async emailVerify(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { id } = job.data as { id: string };

      const user = await userModel.findByIdAndUpdate(
        id,
        {
          emailVerified: Date.now(),
        },
        { new: true }
      );

      await verificationModel.deleteMany({
        userId: id,
        type: VerificationEnum.EMAIL_VERIFICATION,
      });

      // test email
      const template: string = emailTemplates.thankYou();

      emailQueue.sendEmail("sendEmail", {
        receiverEmail: user?.email,
        template,
        subject: "Email Verification Successfull",
      });

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
