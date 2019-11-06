import winston, {Logger}                                       from 'winston'
import SequelizeWinstonTransport                               from './SequelizeWinstonTransport'
import {LOGGER_LOG_ERROR, LOGGER_LOG_INFO, LOGGER_LOG_WARNING} from "./WinstonLoggerConstants"
import * as  _                                                 from 'lodash'


type metaData = string | object

export default class WinstonLoggerClass {

  private logger: Logger

  constructor(options?) {
    this.logger = winston.createLogger({
      transports: [
        new SequelizeWinstonTransport(options)
      ]
    })
  }

  async error(message:string, data?:metaData) {
    if (!_.isNil(data) && _.isString(data)) {
      data = {
        error: data
      }
    }
   await this.log(LOGGER_LOG_ERROR, message, data)
  }

  async info(message:string, data?:metaData) {
    await this.log(LOGGER_LOG_INFO, message, data)
  }

  async warning(message:string, data?:metaData) {
    await this.log(LOGGER_LOG_WARNING, message, data)
  }

 async log(level: string, message?: string, data?: metaData) {

    if (!_.isNil(data) && _.isString(data)) {
      data = {
        data: data
      }
    }
   await  this.logger.log(level, message || '', data)
  }

}


export const winstonLoggerInstance: WinstonLoggerClass = new WinstonLoggerClass()

