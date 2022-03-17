import { Lambda } from "aws-sdk"

const AWSLambda = new Lambda({
  region: process.env.AWS_REGION
})

export default AWSLambda