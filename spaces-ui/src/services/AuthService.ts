// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { AuthStack } from "../../../out/outputs.json";

const awsRegion = "us-west-1";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: AuthStack.SpaceUserPoolId,
    userPoolWebClientId: AuthStack.SpaceUserPoolClientId,
    identityPoolId: AuthStack.SpaceIdentityPoolId,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  private user: CognitoUser | undefined;
  private jwtToken: string | undefined;
  private temporaryCredentials: AwsCredentialIdentity | undefined;

  public async login(
    userName: string,
    password: string
  ): Promise<CognitoUser | undefined> {
    try {
      this.user = (await Auth.signIn(userName, password)) as CognitoUser;
      this.jwtToken = this.user
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken();
      return this.user;
    } catch (error) {
      console.log("error signing in", error);
      return undefined;
    }
  }

  public getUserName() {
    return this.user?.getUsername();
  }

  public async getTemporaryCredentials(): Promise<AwsCredentialIdentity> {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    }
    this.temporaryCredentials = await this.generateTemporaryCredentials();
    return this.temporaryCredentials;
  }

  private async generateTemporaryCredentials(): Promise<AwsCredentialIdentity> {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: AuthStack.SpaceIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!,
        },
      }),
    });
    const credentials =
      (await cognitoIdentity.config.credentials()) as AwsCredentialIdentity;
    return credentials;
  }
}
