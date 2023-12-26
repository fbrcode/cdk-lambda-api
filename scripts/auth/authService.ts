import { Amplify, Auth } from "aws-amplify";
import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const region = "us-west-1";
const userPoolId = "us-west-1_IqbmJwdip";
const identityPoolId = "us-west-1:fef4c39e-b727-42de-aeda-0dfea9f62c87";

// Amplify user auth setup
Amplify.configure({
  Auth: {
    region: region,
    userPoolId: userPoolId,
    userPoolWebClientId: "7nton3liib0pf2pr7vi63ncmiu",
    identityPoolId: identityPoolId,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

// Auth service class (to be called on auth.test.ts)
export class AuthService {
  public async login(username: string, password: string): Promise<CognitoUser> {
    try {
      const result = (await Auth.signIn({ username, password })) as CognitoUser;
      return result;
    } catch (error) {
      console.error("Error signing in", error);
    }
  }

  public async generateTemporaryCredentials(
    user: CognitoUser
  ): Promise<AwsCredentialIdentity> {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: region },
        identityPoolId: identityPoolId,
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
