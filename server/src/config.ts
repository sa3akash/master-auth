import dotenv from "dotenv";

dotenv.config();

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_SEC: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public PORT: number | undefined;
  //   public REDIS_URL: string | undefined;
  //   public CLOUD_NAME: string | undefined;
  //   public CLOUD_API_KEY: string | undefined;
  //   public CLOUD_API_SEC: string | undefined;
  //   public SENDER_EMAIL_PASSWORD: string | undefined;
  //   public SENDER_EMAIL: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || 'mongodb';
    this.JWT_SEC = process.env.JWT_SEC;
    this.NODE_ENV = process.env.NODE_ENV;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.PORT = Number(process.env.PORT) || 5000;
    // this.REDIS_URL = process.env.REDIS_URL || 'redis';
    // this.CLOUD_NAME = process.env.CLOUD_NAME;
    // this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    // this.CLOUD_API_SEC = process.env.CLOUD_API_SEC;
    // this.SENDER_EMAIL = process.env.SENDER_EMAIL;
    // this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
  }

  public validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined || value === null) {
        throw new Error(`${key} env is not defined.`);
      }
    }
  }
}


export const config:Config = new Config();
