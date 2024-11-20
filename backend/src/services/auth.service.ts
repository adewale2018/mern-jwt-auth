export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
} 

export const createAccount = async (data: CreateAccountParams) => {
  // logic should be in the service
  // verify that existing user does not already exist
  // create the new user
  // create verification code
  // send verification email with the code
  // create session
  // sign access token and the refresh token
  // return user and tokens
}
