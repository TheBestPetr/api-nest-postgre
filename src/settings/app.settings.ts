import { config } from 'dotenv';
import * as process from 'process';

config();

export const SETTINGS = {
  PORT: process.env.APP_PORT || '',
  POSTGRESQL_URL: process.env.POSTGRESQL_URL || '',
  NODEMAILER: {
    USER: process.env.EMAIL_ACCOUNT_USER,
    PASSWORD: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
  BASIC: {
    LOGIN: process.env.BASIC_LOGIN || '',
    PASSWORD: process.env.BASIC_PASSWORD || '',
  },
  JWT_SECRET: process.env.JWT_SECRET || '',
};
