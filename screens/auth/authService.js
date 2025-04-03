// authService.js
export const mapAuthError = (error) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "Account disabled";
    case "auth/user-not-found":
      return "Account not found";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already in use";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    default:
      return "Authentication failed. Please try again";
  }
};

export const handleEmailPasswordAuth = async (isLogin, email, password) => {
  const action = isLogin
    ? signInWithEmailAndPassword
    : createUserWithEmailAndPassword;
  return action(auth, email, password);
};
