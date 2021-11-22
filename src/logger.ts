import { createLogger, format, transports } from 'winston';

const myFormat = format.printf(({ level, message, timestamp, data }) => {
  const dataString = JSON.stringify({
    data
  });
  return `${timestamp} - ${level}: ${message} ${
    dataString !== '{}' ? dataString : ''
  }`;
});

const logger = createLogger({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'hh:mm:ss.SSS' }),
    myFormat
  ),
  transports: [new transports.Console()]
});

export { logger };
