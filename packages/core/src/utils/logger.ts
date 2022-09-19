import chalk from 'chalk'
import { addColors, createLogger, format, transports } from 'winston'

class Logger {
  private _logger
  private static instance: Logger

  public static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }

    return Logger.instance
  }

  private constructor() {
    addColors({
      info: 'blue',
      succ: 'green',
      warn: 'yellow',
      error: 'red',
      debug: 'black',
    })

    this._logger = createLogger({
      defaultMeta: { service: 'user-service' },
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      levels: {
        error: 0,
        warn: 1,
        succ: 2,
        info: 3,
        debug: 4,
      },
      transports: [
        new transports.Console({
          handleExceptions: true,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            format.splat(),
            format.colorize(),
            format.printf(({ level, message, timestamp }) =>
              [chalk.whiteBright(timestamp), `[${level}]`, message].join(' ')
            )
          ),
        }),
      ],
    })
  }

  info(...str: Array<string>) {
    this._logger.log('info', str.join(' '))
  }

  success(...str: Array<string>) {
    this._logger.log('succ', str.join(' '))
  }

  warn(...str: Array<string>) {
    this._logger.log('warn', str.join(' '))
  }

  error(...str: Array<string>) {
    this._logger.log('error', str.join(' '))
  }

  debug(...str: Array<string>) {
    this._logger.log('debug', str.join(' '))
  }
}

export const logger = Logger.getInstance()
