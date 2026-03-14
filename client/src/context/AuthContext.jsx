import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('uncovered_token'));

  const login = (newToken) => {
    localStorage.setItem('uncovered_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('uncovered_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
