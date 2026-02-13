import { createContext, useContext, useState, useEffect } from "react";
import { loginUser } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (formData) => {
    const res = await loginUser(formData);

    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
