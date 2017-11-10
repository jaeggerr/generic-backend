import * as jsonapi from './../examples/jsonapi/jsonapi'
import { generateUDID } from './helpers/udid'
import { createConnection, BaseEntity, Connection, getRepository } from 'typeorm'
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
  const response: jsonapi.Document = {}
  let responseCode: number
  try {
    const entityClass: string = req.params.class
    const metadata = connection.getMetadata(entityClass)
    response.data = []
    for (let entity of await getRepository(entityClass).find()) {
      const resource: jsonapi.ResourceObject = {
        type: entityClass
      }
      resource.id = entity[metadata.primaryColumns[0].databaseName]
      resource.attributes = {}
      for (let column of metadata.ownColumns) {
        if (!column.isPrimary && !column.relationMetadata) resource.attributes[column.databaseName] = entity[column.databaseName]
        else if (column.relationMetadata) {
          if (!resource.relationships) resource.relationships = {}
          resource.relationships[column.databaseName] = {
            data: {
              id: entity[column.databaseName],
              type: column.relationMetadata.propertyPath
            }
          }
        }
      }
      (response.data as jsonapi.ResourceObject[]).push(resource)
    }
    responseCode = 200
  } catch (err) {
    console.log(err)
    response.errors = [{
      id: 'myid'
    }]
    responseCode = 404
  } finally {
    res.send(responseCode!, response)
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

    let group = new Group()
    group.id = generateUDID()
    group.name = 'ze group'
    user.group = group

    group = await group.save()
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
