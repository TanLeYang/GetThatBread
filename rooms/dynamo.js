import AWS from "aws-sdk"
import { v4 as uuidv4 } from "uuid"

const AWS_REGION = process.env.AWS_REGION
const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT
const serviceConfiguration = {
  region: AWS_REGION,
  endpoint: DYNAMO_ENDPOINT
}

const dynamoDB = new AWS.DynamoDB(serviceConfiguration)
const dynamoClient = new AWS.DynamoDB.DocumentClient({
  ...serviceConfiguration,
  convertEmptyValues: true
})

const TABLE_NAME = "Rooms"
const tableParams = {
  TableName: TABLE_NAME,
  KeySchema: [{ AttributeName: "roomCode", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "roomCode", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

export function initalizeDynamoDB() {
  if (process.env.NODE_ENV !== "PRODUCTION") {
    return createTable()
  }
}

function createTable() {
  return dynamoDB
    .createTable(tableParams)
    .promise()
    .then((data) => {
      console.log(
        `created table, table description: ${JSON.stringify(data, null, 2)}`
      )
    })
    .catch((err) => {
      console.error(
        `unable to create table, error: ${JSON.stringify(err, null, 2)}`
      )
    })
}

export async function getRoom(roomCode) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      roomCode
    }
  }

  return dynamoClient
    .get(params)
    .promise()
    .then((result) => {
      return result.Item
    })
    .catch((err) => {
      console.error(`failed to get room: ${err}`)
      return null
    })
}

export async function createRoom() {
  const newRoomCode = uuidv4()
  const params = {
    TableName: TABLE_NAME,
    Item: {
      roomCode: newRoomCode
    }
  }

  return dynamoClient
    .put(params)
    .promise()
    .then(() => {
      return newRoomCode
    })
    .catch(() => {
      return ""
    })
}
