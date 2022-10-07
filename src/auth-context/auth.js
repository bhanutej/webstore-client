import { useState, createContext, useContext } from 'react';

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("authUser")));

  const login = user => {
    setUser(user);
  }

  const logout = () => {
    localStorage.setItem("authUser", null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
