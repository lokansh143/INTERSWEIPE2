import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = useMemo(
    () => ({
      user,
      token,
      login: ({ user: nextUser, token: nextToken }) => {
        setUser(nextUser || null);
        setToken(nextToken || null);
      },
      logout: () => {
        setUser(null);
        setToken(null);
      }
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
