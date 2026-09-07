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

  // =====================================================
  // LOAD USER ON REFRESH
  // =====================================================

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/profile");

        const currentUser =
          response.data.user || response.data;

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Authentication restore failed:",
          error
        );

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const data = response.data;
    const token = data.token;

    if (!token) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("token", token);

    const currentUser = data.user || data;

    setUser(currentUser);

    return data;
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    const data = response.data;
    const token = data.token;

    if (token) {
      localStorage.setItem("token", token);
    }

    const currentUser = data.user || data;

    setUser(currentUser);

    return data;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // =====================================================
  // UPDATE USER
  // =====================================================

  const updateUser = (updatedUser) => {
    setUser((previous) => ({
      ...previous,
      ...updatedUser,
    }));
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ee] dark:bg-[#11100f]">
        <div className="text-sm text-[#77716b] dark:text-[#aaa39b]">
          Loading TimeSwap...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        login,
        register,
        logout,
        loading,
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