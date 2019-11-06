import 'reflect-metadata'
import express            from 'express'
import bodyParser         from 'body-parser'
import cors               from 'cors'
import configuration      from '../config/index'
import {initSequelize}    from './sequelize/sequelize'
import createApolloServer from './apolloServer'

const app = express()
app.use(bodyParser.json(), cors())

app.use(function (request, response, next) {
  if (request.method.toUpperCase() === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.status(200)
    response.send()
    return
  }
  next()
});

(async () => {
  await initSequelize()
  const server = createApolloServer()
  const PORT = configuration.PORT || 4000
  server.applyMiddleware({app, path: '/graphql'})
  app.listen({port: PORT}, () => {
    console.log(`Apollo Server on http://localhost:${PORT}/graphql`)
  });

})()

