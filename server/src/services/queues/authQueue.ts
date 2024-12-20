import { BaseQueue } from "./baseQueue";
import { authWorker } from "./workers/authWorker";

class AuthQueue extends BaseQueue {
  constructor() {
    super("authQueue");
    this.processJob('addAuthDataInDB', 5, authWorker.registerUser);
  }

  public registerUserInDB(name: string, data: any): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
