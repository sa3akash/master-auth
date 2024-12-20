import { BaseQueue } from "./baseQueue";
import { authWorker } from "./workers/authWorker";

class AuthQueue extends BaseQueue {
  constructor() {
    super("authQueue");
    this.processJob('addAuthDataInDB', 5, authWorker.registerUser);
    this.processJob('verifyEmail', 5, authWorker.emailVerify);
  }

  public registerUserInDB(name: string, data: any): void {
    this.addJob(name, data);
  }
  public verifyEamil(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
