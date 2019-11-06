import winston, {Logger}                                       from 'winston'
import SequelizeWinstonTransport                               from './SequelizeWinstonTransport'
import {LOGGER_LOG_ERROR, LOGGER_LOG_INFO, LOGGER_LOG_WARNING} from './WinstonLoggerConstants'
import * as  _                                                 from 'lodash'


type metaData = string | object

export default class WinstonLoggerClass {

    private logger: Logger

    constructor (options?) {
        this.logger = winston.createLogger({
            transports: [
                new SequelizeWinstonTransport(options)
            ]
        })
    }

    error (message: string, data?: metaData) {
        this.log(LOGGER_LOG_ERROR, message, data)
    }

    info (message: string, data?: metaData) {
        this.log(LOGGER_LOG_INFO, message, data)
    }

    warning (message: string, data?: metaData) {
        this.log(LOGGER_LOG_WARNING, message, data)
    }

    log (level: string, message?: string, data?: metaData) {

        if (!_.isNil(data) && _.isString(data)) {
            data = {
                data: data
            }
        }
        this.logger.log(level, message || '', data)
    }
}
export const winstonLoggerInstance: WinstonLoggerClass = new WinstonLoggerClass()

