import { Amplify, Auth } from "aws-amplify";
import { type CognitoUser } from "@aws-amplify/auth";

// Amplify user auth setup
Amplify.configure({
  Auth: {
    region: "us-west-1",
    userPoolId: "us-west-1_IqbmJwdip",
    userPoolWebClientId: "7nton3liib0pf2pr7vi63ncmiu",
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
}
