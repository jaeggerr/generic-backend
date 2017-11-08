import { generateUDID } from './helpers/udid'
import { createConnection, BaseEntity } from 'typeorm'
import User from './entities/user'
import * as restify from 'restify'

const config = {
  port: 1337
}

async function main () {
  await createConnection({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [
      __dirname + '/entities/*.ts'
    ],
    synchronize: true
  })
}

// Create server
const server = restify.createServer()
server.use(restify.plugins.bodyParser())

server.get('/', (req, res, next) => {
  res.send(200, 'Hello world')
  next()
})

server.get('/entities/:class', async (req, res, next) => {
  try {
    const entityClass = require('./entities/' + req.params.class).default as typeof BaseEntity
    res.send(200, await entityClass.find())
  } catch (error) {
    console.log(error)
    res.send(400, 'nope')
  }
  next()
})

interface JSONAPIResponse {
  data: {
    type: string
    id: string | number
    attributes: {
      [key: string]: string
    }
  }
}

server.post('/entities/:class', async (req, res, next) => {
  try {
    const entityClass = require('./entities/' + req.params.class).default as typeof BaseEntity
    let user = new User()
    user.email = 'bibi'
    user.username = 'gogo'
    user.id = generateUDID()
    user = await user.save()
    const attributes: any = Object.assign({}, user)
    delete attributes.id

    const send: JSONAPIResponse = {
      data: {
        type: req.params.class,
        id: user.id,
        attributes: attributes
      }
    }
    res.send(200, send)
  } catch (error) {
    console.log(error)
    res.send(400, 'nope')
  }
  next()
})

// Listen
server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`)
})

main()
