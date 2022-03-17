import AWS from "aws-sdk"
import { CodeLanguage } from "./coding"

const AWS_REGION = "local"
const AWS_ENDPOINT = "http://localhost:8000"
const serviceConfiguration = {
  region: AWS_REGION,
  endpoint: AWS_ENDPOINT
}

const dynamoDB = new AWS.DynamoDB(serviceConfiguration)
const dynamoClient = new AWS.DynamoDB.DocumentClient({
  region: AWS_REGION,
  endpoint: AWS_ENDPOINT,
  convertEmptyValues: true
})

const TABLE_NAME = "Docs"
const tableParams: AWS.DynamoDB.CreateTableInput = {
  TableName: TABLE_NAME,
  KeySchema: [
    { AttributeName: "roomCode", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "roomCode", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

export const initializeDynamoDB = async () => {
  if (process.env.NODE_ENV !== "PRODUCTION") {
    return createTable()
  }
}

const createTable = async () => {
  return dynamoDB.createTable(tableParams).promise()
    .then((data) => {
      console.log(`created table, table description: ${JSON.stringify(data, null, 2)}`)
    })
    .catch((err) => {
      console.error(`unable to create table, error: ${JSON.stringify(err, null, 2)}`)
    })
}

export type RoomDocument = {
  roomCode: string
  content: string
  language: CodeLanguage
}

export const getOrCreateDocument = async (roomCode: string): Promise<RoomDocument> => {
  const result = await getDocument(roomCode)
  if (result.Item) {
    return result.Item as RoomDocument
  }

  await addOrUpdateDocument({ roomCode: roomCode, content: "", language: "" })
  const newResult = await getDocument(roomCode)
  return newResult.Item as RoomDocument
}

const getDocument = async (roomCode: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      roomCode
    }
  }

  return dynamoClient.get(params).promise()
}

export const addOrUpdateDocument = async (document: RoomDocument) => {
  const params = {
    TableName: TABLE_NAME,
    Item: document
  }

  return dynamoClient.put(params).promise()
}

export const deleteDocument = async (roomCode: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      roomCode
    }
  }

  return dynamoClient.delete(params).promise()
}
