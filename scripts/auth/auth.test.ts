import { AuthService } from "./authService";

// Test user authentication with Amplify to Cognito
async function testAuth() {
  const authService = new AuthService();
  const loginResult = await authService.login("demo", "Demo-999");
  const jwtToken = loginResult
    .getSignInUserSession()
    .getIdToken()
    .getJwtToken();
  console.log(`JWT Token: ${jwtToken}`);
}

testAuth();
