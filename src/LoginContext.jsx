import { createContext } from "react";

const LoginContext = createContext();

export default LoginContext;

export const LoginInitState = {
  loggedIn: false,
  ta: {
    id: '',
    email: '',
  },
  usersOfTA: [],
  curUser: '',
}
