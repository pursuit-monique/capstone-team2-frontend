import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Cleanup the subscription when unmounted
  }, []);

  const value = {
    signup,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {" "}
      {/* Provide the 'value' to the context */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
