import 'reflect-metadata'
import {createSchemaGraphQL}                      from './sequelize/sequelize'
import {ApolloServer}                             from 'apollo-server-express'
import {ApolloServerTestClient, createTestClient} from 'apollo-server-testing'
import * as _                                     from 'lodash'

let server = void(0)
let testServer = void(0)

const context = ({req}) => {
    let token = (req && req.headers && req.headers.Authorization) || ''
    token = token.replace(/^\w+\s+(.*)$/,'$1')
    return {
        jwtToken: token
    }
}

const createApolloServer = () => {
    if (server) {
        return server 
    }
    const schema = createSchemaGraphQL()
    server = new ApolloServer({
        schema,
        context: (data) => context(data),
        formatError (err) {
            return err
        }
    })
    return server
}

interface ICreateTestApolloServer extends  ApolloServerTestClient {
    setContext: (data: any)=> void
    resetContext: ()=> void
}

const createTestApolloServer = (): ICreateTestApolloServer => {
    if (testServer) {
        testServer.resetContext()
        return testServer
    }
    const schema = createSchemaGraphQL()

    let testReq = {}

    const server = new ApolloServer({
        schema,
        context: (data) => context(_.merge({},data,testReq)),
        formatError (err) {
            return err
        }
    })

    const setContext = (data) => {
        testReq = _.merge({},testReq,data)
    }

    const resetContext = () => {
        testReq = {}  
    }
    testServer = createTestClient(server)
    testServer = {
        ...testServer,
        ...{
            setContext,
            resetContext
        }
    }
    return testServer
}

export default createApolloServer
export {
    createTestApolloServer

}
