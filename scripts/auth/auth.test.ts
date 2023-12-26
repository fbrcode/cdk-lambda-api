import {
  S3Client,
  ListBucketsCommand,
  ListBucketsCommandOutput,
} from "@aws-sdk/client-s3";
import { AuthService } from "./authService";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const userName = "demo";
const userPassword = "Demo-999";
const region = "us-west-1";

// Test user authentication with Amplify to Cognito
async function testAuth() {
  const authService = new AuthService();
  const loginResult = await authService.login(userName, userPassword);

  // get JWT token (allow REST API access)
  const jwtToken = loginResult
    .getSignInUserSession()
    .getIdToken()
    .getJwtToken();
  console.log(`JWT Token: ${jwtToken}`);

  // get IAM temporary credentials (allow SDK access to AWS resources)
  const credentials = await authService.generateTemporaryCredentials(
    loginResult
  );
  console.log(`IAM temporary credentials: ${JSON.stringify(credentials)}`);

  // list S3 buckets
  const bucketList = await listBuckets(credentials);
  console.log(`S3 buckets: ${JSON.stringify(bucketList.Buckets)}`);
}

async function listBuckets(
  credentials: AwsCredentialIdentity
): Promise<ListBucketsCommandOutput> {
  const client = new S3Client({ region, credentials });
  const command = new ListBucketsCommand({});
  try {
    return await client.send(command);
  } catch (error) {
    console.error(`List buckets error: ${error.message}`);
  }
}

testAuth();
