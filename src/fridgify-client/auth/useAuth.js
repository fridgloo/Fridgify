import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signIn = (authToken) => {
    authStorage.storeToken(authToken);
    const user = jwtDecode(authToken);
    setUser(user);
  };

  const signOut = () => {
    authStorage.removeToken();
    setUser(null);
  };

  return { user, signIn, signOut };
};
