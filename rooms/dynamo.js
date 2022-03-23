import AWS from "aws-sdk"

const AWS_REGION = process.env.AWS_REGION
const DYNAMO_ENDPOINT = process.env.DYNAMO_ENDPOINT
const serviceConfiguration = {
  region: AWS_REGION,
  endpoint: AWS_ENDPOINT
}

const dynamoDB = new AWS.DynamoDB(serviceConfiguration)
const dynamoClient = new AWS.DynamoDB.DocumentClient({
  ...serviceConfiguration,
  convertEmptyValues: true
})
