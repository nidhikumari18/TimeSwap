import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import api from "../services/api";
  
  const AuthContext = createContext(null);
  
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      checkAuth();
    }, []);
  
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
  
      // No token = definitely logged out
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
  
      try {
        const response = await api.get("/auth/me");
  
        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error.response?.data?.message ||
            error.message
        );
  
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    const login = (token, userData) => {
      localStorage.setItem("token", token);
  
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem("token");
  
      setUser(null);
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error(
        "useAuth must be used inside AuthProvider"
      );
    }
  
    return context;
  };