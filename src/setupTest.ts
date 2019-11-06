import 'reflect-metadata'
import {initSequelize, sequelize}   from './sequelize/sequelize'
import {createTestApolloServer}     from './apolloServer'

beforeAll(async () => {
    await initSequelize('test', true)
    createTestApolloServer()
})

afterAll(async (done) => {
    setTimeout(async () => {
        await sequelize.close()
        done()
    },1000)
})

