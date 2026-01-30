// src/services/auth.ts

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';


// shape of tokens returned on signIn
interface AuthSession {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

// Pull from Vite’s env, not process.env
const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId:   import.meta.env.VITE_COGNITO_CLIENT_ID,
};
const userPool = new CognitoUserPool(poolData);


/**
 * Sign up a new user (sends verification code to their email)
 */
// export function signUp(email: string, password: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     const attrs: CognitoUserAttribute[] = [
//       new CognitoUserAttribute({ Name: 'email', Value: email }),
//     ];

//     // pass an empty array for “validationData” instead of null
//     userPool.signUp(email, password, attrs, [], (err, result) =>
//       err ? reject(err) : resolve(result)
//     );
//   });
// }

export function signUp(
  email: string,
  password: string,
  username: string
): Promise<any> {
  const attrs: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'email',             Value: email    }),
    new CognitoUserAttribute({ Name: 'preferred_username', Value: username }),
  ];

  return new Promise((resolve, reject) => {
    // still use email as the Cognito “Username”
    userPool.signUp(email, password, attrs, [], (err, result) =>
      err ? reject(err) : resolve(result)
    );
  });
}

/**
 * Confirm a newly signed-up user with the code they received
 */
export function confirmSignUp(
  email: string,
  code: string
): Promise<any> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) =>
    user.confirmRegistration(code, true, (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );
}

/**
 * Authenticate a user and return their session tokens
 */
export function signIn(
  email: string,
  password: string
): Promise<AuthSession> {
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });
  const user = new CognitoUser({ Username: email, Pool: userPool });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: session =>
        resolve({
          idToken:      session.getIdToken().getJwtToken(),
          accessToken:  session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        }),
      onFailure: err => reject(err),
      newPasswordRequired: () =>
        reject(new Error('New password is required')),
    });
  });
}

/**
 * Start the “forgot password” flow: send a reset code
 */
export function forgotPassword(email: string): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.forgotPassword({
      // Required by the TS signature
      onSuccess: () => resolve(),
      onFailure: err => reject(err),
      // Called when the code has been sent
      inputVerificationCode: () => resolve(),
    });
  });
}

/**
 * Complete the forgot-password flow with code + new password
 */
export function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    user.confirmPassword(code, newPassword, {
      onSuccess: () => resolve(),
      onFailure: err => reject(err),
    });
  });
}



/**
 * Log out the current user
 */
export function signOut(): void {
  const user = userPool.getCurrentUser();
  if (user) user.signOut();
}
