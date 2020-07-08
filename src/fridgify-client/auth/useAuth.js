import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const signOut = () => {
    setUser(null);
    authStorage.removeToken();
  };

  return { user, signIn, signOut };
};
