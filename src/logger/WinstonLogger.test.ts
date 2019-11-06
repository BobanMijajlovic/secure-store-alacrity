import {winstonLoggerInstance} from "./WinstonLoggerClass";

describe("Winston logger test", () => {

  it('write info', async (done)=> {
    await  winstonLoggerInstance.info("Test info")
    done()
  })

})
