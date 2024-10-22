export const getUserId = (authorizationHeader?: string) => {
  if (!authorizationHeader || authorizationHeader.split(" ")[0] !== "Bearer") {
    return null;
  }
  const token = authorizationHeader.split(" ")[1];
  // Get user id from WorkOS using the token. return null if user doesn't exist.
  // ...
  return 123;
};
