import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function AuthContextProvider() {
  const [session, setSession] = useState(undefined);
  return (
    <AuthContext.Provider value={session}>AuthContext</AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
