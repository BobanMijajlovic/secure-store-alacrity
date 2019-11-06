import  Transport        from 'winston-transport'
import {LoggerWinston}   from '../sequelize/models'
import {LOGGER_LOG_INFO} from './WinstonLoggerConstants'

export default class SequelizeWinstonTransport extends Transport {

    private options: any
    constructor (options?: any) {
        super(options)
        this.options = options
    }

    async log (info: any, callback) {
        const data = {
            level: info.level || LOGGER_LOG_INFO,
            message: info.message,
            meta: info.data
        }
        await LoggerWinston.addLog(data)
        callback()

    }
}

