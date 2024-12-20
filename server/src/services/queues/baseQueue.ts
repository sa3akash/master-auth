import { config } from "@root/config";
import Queue, { Job } from "bull";

export abstract class BaseQueue {
  queue: Queue.Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_URL}`);

    this.queue.on("completed", (job: Job) => {
      job.remove();
    });

    this.queue.on("global:completed", (jobId: string) => {
      console.log(`Job ${jobId} completed.`);
    });

    this.queue.on("global:stalled", (jobId: string) => {
      console.log(`Job ${jobId} stalled.`);
    });
  }

  protected addJob(name: string, data: any): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 }, removeOnComplete: true, removeOnFail: false });
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
