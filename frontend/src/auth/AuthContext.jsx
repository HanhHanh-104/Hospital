import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [maTK, setMaTK] = useState(localStorage.getItem("maTK"));
  const [loaiNS, setLoaiNS] = useState(localStorage.getItem("loaiNS"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("maTK", maTK);
      localStorage.setItem("loaiNS", loaiNS);
    }
  }, [token, role, maTK, loaiNS]);

  const logout = () => {
    setToken(null);
    setRole(null);
    setMaTK(null);
    setLoaiNS(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole, maTK, setMaTK, loaiNS, setLoaiNS, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
