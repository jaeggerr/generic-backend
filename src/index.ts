import { generateUDID } from './helpers/udid'
import { createConnection, BaseEntity, Connection } from 'typeorm'
import User from './entities/user'
import Group from './entities/group'
import * as restify from 'restify'

let connection: Connection
const config = {
  port: 1337
}

async function main () {
  connection = await createConnection({
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
    const metadata = connection.getMetadata(entityClass)
    const response: any[] = []
    for (let entity of await entityClass.find()) {
      const e: any = {}
      e.id = entity[metadata.primaryColumns[0].databaseName]
      e.attributes = {}
      for (let column of metadata.ownColumns) {
        if (!column.isPrimary) e.attributes[column.databaseName] = entity[column.databaseName]
      }
      response.push(e)
    }
    res.send(200, response)
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
    user.password = 'zzzzz'
    user.id = generateUDID()
    user = await user.save()

    const group = new Group()
    group.name = 'ze group'
    user.group = group

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
