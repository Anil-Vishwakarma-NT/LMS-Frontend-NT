
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    const storedToken = localStorage.getItem('authtoken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('authtoken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authtoken');
    setToken(null);
    console.log("Logged out successfully", localStorage.getItem('authtoken'));;
    setRoles([]);
    setFullName("")
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
