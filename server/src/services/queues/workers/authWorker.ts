import userModel from "@models/userModel";
import { IRegisterData } from "@services/interfaces/user.interface";
import { DoneCallback, Job } from "bull";

class AuthWorker {
  public async registerUser(job: Job, done: DoneCallback): Promise<void> {
    try {
      const data = job.data as IRegisterData;

      // const user = await userModel.create(data)
      // const user = await data.save()

      console.log({ data });

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      console.log(err);
      done(err as Error);
    }
  }
  public async emailVerify(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { id } = job.data as { id: string };

      await userModel.findByIdAndUpdate(
        id,
        {
          emailVerified: new Date(),
        },
        { new: true }
      );

      //todo: send email to notify user

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      console.log(err);
      done(err as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
