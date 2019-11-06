import {winstonLoggerInstance} from './WinstonLoggerClass'

describe('Winston logger test', () => {

    it('write info', (done) => {
        winstonLoggerInstance.info('Test info')
        winstonLoggerInstance.error('Test error', 'meta data - error')
        winstonLoggerInstance.warning('Test warning', 'meta data - warn')
        done()
    })

    it('read all data', (done) => {
        setTimeout(async () => {

            done()
        })
    })

})
